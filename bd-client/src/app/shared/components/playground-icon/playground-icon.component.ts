import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BackgroundService } from '../../../core/services/background.service';
import { IconService } from '../../../core/services/icon.service';
import { ImageService } from '../../../core/services/image.service';
import { LabService } from '../../../core/services/lab.service';
import { IconDto } from '../../../models/dto/icon-dto';
import { IconPosition } from '../../../models/enums/icon-position';
import { IconType } from '../../../models/enums/icon-type';
import { LayoutMode } from '../../../models/enums/layout-mode';
import { ColorExtendedData } from '../../../models/interfaces/color-data';
import { Coordinates } from '../../../models/interfaces/coordinates';
import { ImageHelper } from '../../helpers/image.helper';

@Component({
  selector: 'bd-playground-icon',
  templateUrl: './playground-icon.component.html',
  styleUrls: ['./playground-icon.component.scss'],
})
export class PlaygroundIconComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public icon: IconDto;
  @Input() public position = IconPosition.Center;
  @Input() public hover = false;
  @Input() public canRotate = true;
  @ViewChild('svgContainer', { static: true }) public svgContainerEl: ElementRef<HTMLDivElement>;

  public IconType = IconType;
  public get isSelected$() {
    return this.labService.positionChanged.pipe(map((position) => this.position === position));
  }
  public get isVector() {
    return this.icon?.type === IconType.Vector;
  }
  public get isBackground() {
    return this.position === IconPosition.Background;
  }
  public isRotating = false;
  public isMoving = false;
  public get iconCoordinates() {
    const coordinates = this.labService.getIconCoordinates(this.position);

    // fix the background position when no background selected
    if (this.isBackground && !this.backgroundService.background) {
      coordinates.x -= 74;
      coordinates.y -= 74;
    }

    return coordinates;
  }
  public get iconSize() {
    return this.labService.getIconSize(this.position);
  }
  public get transformData() {
    return `translate(${this.updatedPosition?.x || 0}px, ${this.updatedPosition?.y || 0}px) rotate(${
      this.rotationAngleControl.value || 0
    }deg)`;
  }
  public updatedPosition: Coordinates;
  public get rotationAngle() {
    return this.rotationAngleControl.value as number;
  }
  public ImageHelper = ImageHelper;

  private get svgContainer() {
    return this.svgContainerEl.nativeElement;
  }
  private svgBody: SVGSVGElement;
  private destroyed$ = new Subject<void>();
  private rotationCenter: Coordinates;
  private mouseMoveListenerFn: () => void;
  private mouseUpListenerFn: () => void;
  private rotationAngleControl = new FormControl();
  private defaultPosition: Coordinates;

  constructor(
    private readonly labService: LabService,
    private readonly renderer: Renderer2,
    private readonly imageService: ImageService,
    private readonly iconService: IconService,
    private readonly backgroundService: BackgroundService
  ) {}

  public ngOnInit() {
    this.labService.colorChanged
      .pipe(
        takeUntil(this.destroyed$),
        filter((data) => data.position === this.position && this.isVector && !!this.svgBody)
      )
      .subscribe((data) => this.fillElements(data));

    this.labService.layoutModeChanged
      .pipe(
        takeUntil(this.destroyed$),
        filter(
          (data) =>
            // only listen to layout mode changes that may affect the main icon size
            this.position === IconPosition.Center &&
            (data.mode === LayoutMode.Single || data.oldMode === LayoutMode.Single)
        ),
        map(({ mode }) => mode)
      )
      .subscribe((mode) => this.setSvgSize(this.svgBody, mode));

    this.mouseMoveListenerFn = this.renderer.listen('document', 'mousemove', (e) => {
      this.handleRotation(e);
      this.handleMove(e);
    });
    this.mouseUpListenerFn = this.renderer.listen('document', 'mouseup', (e) => {
      this.toggleRotate(false);
      this.toggleMove(false, e);
    });

    this.rotationAngleControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        tap((angle) => this.labService.setAngle(angle, this.position))
      )
      .subscribe();

    this.labService.rotationAnglesChanged
      .pipe(
        takeUntil(this.destroyed$),
        map((angles) => angles.get(this.position)),
        tap((angle) => this.rotationAngleControl.setValue(angle, { emitEvent: false }))
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.mouseMoveListenerFn();
    this.mouseUpListenerFn();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.icon?.id === (changes?.icon?.previousValue as IconDto)?.id) {
      // the icon has not been changed
      return;
    }

    if (this.svgBody && this.svgContainer.contains(this.svgBody)) {
      this.renderer.removeChild(this.svgContainer, this.svgBody);
    }

    if (!this.icon) {
      return;
    }

    // TODO: check how to simplify this
    const emitFilledElements = !!changes?.icon?.previousValue || this.position === IconPosition.Background;

    // try getting a cached version of the original processed SVG
    const cachedSvg = this.imageService.getIconSvg(this.icon.id);
    if (cachedSvg) {
      this.setSvgBody(cachedSvg, emitFilledElements).subscribe();
    } else {
      const fileName = this.icon.url.split('/').pop();

      if (this.icon.type === IconType.Vector) {
        return this.iconService
          .parseSvg(fileName, this.isBackground)
          .pipe(switchMap((svg) => this.setSvgBody(svg, emitFilledElements)))
          .subscribe();
      } else {
        return this.iconService
          .parseRaster(fileName)
          .pipe(switchMap(({ base64 }) => this.setSvgBody(this.createSvgBody(base64), emitFilledElements)))
          .subscribe();
      }
    }
  }

  public selectIconPosition() {
    if (!this.position) {
      return;
    }

    this.labService.setPosition(this.position, this.svgBody);
  }

  public toggleRotate(isRotating: boolean) {
    if (!this.canRotate || this.isRotating === isRotating) {
      return;
    }

    this.isRotating = isRotating;
    if (isRotating) {
      const { left, top, width, height } = this.svgContainer.getBoundingClientRect();
      this.rotationCenter = {
        x: left + width / 2,
        y: top + height / 2,
      };
    } else {
      this.rotationCenter = null;
    }
  }

  public toggleMove(isMoving: boolean, e: MouseEvent) {
    if (this.isMoving === isMoving) {
      return;
    }

    this.isMoving = isMoving;
    if (isMoving) {
      this.defaultPosition = { x: e.clientX, y: e.clientY };
    } else {
      this.defaultPosition = null;
    }
  }

  private handleRotation(e: MouseEvent) {
    if (!this.canRotate || !this.isRotating || !this.rotationCenter) {
      return;
    }

    const coordinates: Coordinates = {
      x: e.clientX - this.rotationCenter.x,
      y: -(e.clientY - this.rotationCenter.y),
    };

    const oldRotationAngle = this.rotationAngleControl.value;
    let newRotationAngle = Math.round(Math.atan2(coordinates.x, coordinates.y) * (180 / Math.PI));

    // Decrease too intense rotation due to the fast angle change. Force +/-1 degree change instead.
    if (Math.abs(newRotationAngle - oldRotationAngle) > 1) {
      newRotationAngle = newRotationAngle > oldRotationAngle ? oldRotationAngle + 1 : oldRotationAngle - 1;
    }

    // Restrict the rotation in the [-90; 90] range limit
    if (newRotationAngle > ImageHelper.MAX_ROTATION_ANGLE) {
      newRotationAngle = ImageHelper.MAX_ROTATION_ANGLE;
    } else if (newRotationAngle < -ImageHelper.MAX_ROTATION_ANGLE) {
      newRotationAngle = -ImageHelper.MAX_ROTATION_ANGLE;
    }

    this.rotationAngleControl.setValue(newRotationAngle);
  }

  private handleMove(e: MouseEvent) {
    if (!this.isMoving) {
      return;
    }

    this.updatedPosition = {
      x: e.clientX - this.defaultPosition.x,
      y: e.clientY - this.defaultPosition.y,
    };
  }

  private createSvgBody(imgBase64: string) {
    const svgBody: SVGSVGElement = this.renderer.createElement('svg', ImageHelper.SVG_NAMESPACE);

    const imageEl: SVGImageElement = this.renderer.createElement('image', ImageHelper.SVG_NAMESPACE);
    this.renderer.addClass(imageEl, ImageHelper.RASTER_IMAGE_CSS_CLASS);
    this.renderer.setAttribute(imageEl, 'href', imgBase64);

    const groupWrapperEl: SVGImageElement = this.renderer.createElement('g', ImageHelper.SVG_NAMESPACE);
    this.renderer.appendChild(groupWrapperEl, imageEl);

    this.renderer.appendChild(svgBody, groupWrapperEl);

    return svgBody;
  }

  private setSvgBody(svgBody: SVGSVGElement, emitFilledElements: boolean) {
    return this.labService.layoutModeChanged.pipe(
      first(),
      map(({ mode }) => {
        svgBody = this.imageService.addFillGroups(svgBody);

        this.setSvgSize(svgBody, mode);
        this.setSvgTitle(svgBody);

        this.renderer.appendChild(this.svgContainer, svgBody);
        this.imageService.setIconSvg(this.icon.id, svgBody);

        this.svgBody = svgBody;

        this.labService.setSvg(svgBody, this.position, emitFilledElements);
      })
    );
  }

  private fillElements(data: ColorExtendedData) {
    const elements = this.svgBody.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="${data.index}"]`);
    elements.forEach((el) => el.setAttribute('fill', data.color));

    this.labService.setSvg(this.svgBody, this.position);
  }

  private setSvgSize(svgBody: SVGSVGElement, mode: LayoutMode) {
    if (!svgBody) {
      return;
    }

    const svgSize = this.labService.getIconSize(this.position, mode);
    svgBody.setAttribute('width', svgSize.width.toString());
    svgBody.setAttribute('height', svgSize.height.toString());

    const innerRasterImage = svgBody.querySelector<SVGImageElement>(`.${ImageHelper.RASTER_IMAGE_CSS_CLASS}`);
    if (innerRasterImage) {
      this.renderer.setAttribute(innerRasterImage, 'width', svgSize.width.toString());
      this.renderer.setAttribute(innerRasterImage, 'height', svgSize.height.toString());
    }
  }

  private setSvgTitle(svgBody: SVGSVGElement) {
    // set the title for newly created SVG
    const svgTitle = svgBody.querySelector('title');
    if (svgTitle) {
      svgTitle.textContent = this.icon.name;
    }
  }
}
