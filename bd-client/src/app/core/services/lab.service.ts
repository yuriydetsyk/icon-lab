import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { filter, first, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { IconDto } from '../../models/dto/icon-dto';
import { IconPosition } from '../../models/enums/icon-position';
import { IconType } from '../../models/enums/icon-type';
import { LayoutMode } from '../../models/enums/layout-mode';
import { StorageKey } from '../../models/enums/storage-key';
import { ColorData, ColorExtendedData } from '../../models/interfaces/color-data';
import { Coordinates } from '../../models/interfaces/coordinates';
import { FilledElementsData } from '../../models/interfaces/filled-elements-data';
import { LayoutModeChangeData } from '../../models/interfaces/layout-mode-change-data';
import { PositionSettings } from '../../models/interfaces/position-settings';
import { Sizes } from '../../models/interfaces/sizes';
import { ArrayHelper } from '../../shared/helpers/array.helper';
import { IconHelper } from '../../shared/helpers/icon.helper';
import { ImageHelper } from '../../shared/helpers/image.helper';
import { BackgroundService } from './background.service';
import { IconService } from './icon.service';
import { ImageService } from './image.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LabService implements OnDestroy {
  public artboardName: string;
  public get layoutModeChanged() {
    return this.layoutMode$.asObservable();
  }
  public get iconsChanged() {
    return this.icons$.pipe(
      startWith(new Map<IconPosition, IconDto>([])),
      switchMap(() => this.positionSettings$),
      map((settings) => new Map([...settings].map(([pos, setting]) => [pos, setting.icon])))
    );
  }
  public get iconChanged() {
    return this.icon$.asObservable();
  }
  public get positionSettingsChanged() {
    return this.positionSettings$.asObservable();
  }
  public get positionChanged() {
    return this.position$.asObservable();
  }
  public get colorChanged() {
    return this.color$.asObservable();
  }
  public get savedColorsChanged() {
    return this.savedColors$.asObservable();
  }
  public get filledElementsChanged() {
    return this.filledElements$.asObservable();
  }
  public get recentIconsChanged() {
    // get last 8 items
    return this.recentIcons$
      .asObservable()
      .pipe(map((recentIcons) => ArrayHelper.unique(recentIcons, (item) => item.id).slice(0, 8)));
  }
  public get availablePositionsChanged() {
    return this.layoutMode$.pipe(map(({ mode }) => this.getAvailablePositions(mode)));
  }
  public get rotationAnglesChanged() {
    return this.rotationAngles$.pipe(
      startWith(new Map<IconPosition, IconDto>([])),
      switchMap(() => this.positionSettings$),
      map((settings) => new Map([...settings].map(([pos, setting]) => [pos, setting.rotationAngle])))
    );
  }
  public get hasIconPosition$() {
    return this.position$.pipe(map((position) => ![IconPosition.Background, null].includes(position)));
  }
  public get hasBackgroundPosition$() {
    return this.position$.pipe(map((position) => position === IconPosition.Background));
  }
  private position$ = new BehaviorSubject<IconPosition>(null);
  private positionSettings$ = new BehaviorSubject(new Map<IconPosition, PositionSettings>());
  private icons$ = new Subject<void>();
  private icon$ = new Subject<IconPosition>();
  private color$ = new Subject<ColorExtendedData>();
  private savedColors$ = new BehaviorSubject<string[]>([]);
  private layoutMode$ = new BehaviorSubject<LayoutModeChangeData>({ mode: LayoutMode.BottomRight });
  private filledElements$ = new BehaviorSubject<FilledElementsData[]>(null);
  private recentIcons$ = new BehaviorSubject<IconDto[]>([]);
  private svgBodies = new Map<IconPosition, SVGSVGElement>();
  private rotationAngles$ = new Subject<void>();
  private get position() {
    return this.position$.value;
  }
  private get positionSettings() {
    return this.positionSettings$.value;
  }
  private get savedColors() {
    return this.savedColors$.value;
  }
  private get layoutMode() {
    return this.layoutMode$.value.mode;
  }
  private get recentIcons() {
    return this.recentIcons$.value;
  }
  private cachedData: {
    settings: Map<IconPosition, PositionSettings>;
    layoutMode: LayoutMode;
    savedColors: string[];
  };
  private destroyed$ = new Subject<void>();

  constructor(
    private readonly iconService: IconService,
    private readonly storageService: StorageService,
    private readonly imageService: ImageService,
    private readonly backgroundService: BackgroundService
  ) {
    this.initCachedData();

    // TODO: simplify
    // setup initial icons once
    combineLatest([this.iconService.getIcons(), this.layoutModeChanged])
      .pipe(
        takeUntil(this.destroyed$),
        switchMap(([apiIcons, { mode, oldMode }]) =>
          combineLatest([of(apiIcons), of({ mode, oldMode }), this.iconsChanged.pipe(first())])
        )
      )
      .subscribe(([apiIcons, { mode, oldMode }, localIcons]) => {
        this.setMainIcon(localIcons, apiIcons);
        if (mode !== LayoutMode.Single) {
          this.setSubIcon(mode, oldMode, localIcons, apiIcons);
        }
      });

    // clear background SVG after it's unset
    this.backgroundService.backgroundChanged
      .pipe(
        takeUntil(this.destroyed$),
        filter((background) => !background)
      )
      .subscribe(() => this.svgBodies.delete(IconPosition.Background));
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public setIcon(icon: IconDto, position = this.position) {
    if (!position) {
      return;
    }

    const previousIcon = this.positionSettings.get(position)?.icon;
    if (previousIcon?.id === icon.id) {
      return;
    }

    const newMap = new Map(this.positionSettings);
    newMap.set(position, { ...newMap.get(position), icon });
    this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);

    this.positionSettings$.next(newMap);
    this.icons$.next();
    this.recentIcons$.next([icon, ...this.recentIcons.filter((item) => item.id !== icon.id)]);
    this.icon$.next(position);
  }

  public setPositionSettings(settings: Map<IconPosition, PositionSettings>, saveToStorage = true) {
    const newMap = new Map(settings);

    if (saveToStorage) {
      this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);
    }

    this.positionSettings$.next(newMap);
    this.icons$.next();
    // as selected icons could change, also update the recent icons list
    this.recentIcons$.next(
      [...newMap.values()].filter((item) => item.icon).map((item) => item.icon)
    );
    this.rotationAngles$.next();
  }

  public setPositionSetting(setting: PositionSettings, position: IconPosition) {
    if (!position) {
      return;
    }

    const newMap = new Map(this.positionSettings);
    newMap.set(position, setting);
    this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);

    this.positionSettings$.next(newMap);
    this.icons$.next();
    // as selected icons could change, also update the recent icons list
    this.recentIcons$.next(
      [...newMap.values()].filter((item) => item.icon).map((item) => item.icon)
    );
    this.rotationAngles$.next();
  }

  public clearPositionSetting(position = this.position) {
    if (!position) {
      return;
    }

    const newMap = new Map(this.positionSettings);
    newMap.delete(position);
    this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);
    this.positionSettings$.next(newMap);
    this.icons$.next();
  }

  public setPosition(position: IconPosition, svgBody?: SVGSVGElement) {
    if (this.position === position) {
      return;
    }

    this.position$.next(position);

    if (svgBody) {
      this.setSvg(svgBody, position, true);
    } else {
      this.filledElements$.next([]);
    }
  }

  public unsetPosition() {
    this.setPosition(null);

    // Side-effect: blur any focused position
    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLElement && activeEl.classList.contains(ImageHelper.ICON_CONTAINER_CSS_CLASS)) {
      activeEl.blur();
    }
  }

  public setColor(color: string, index: string, position = this.position) {
    if (!position) {
      return;
    }

    const currentPositionSettings = this.positionSettings.get(position);
    const newMap = new Map(this.positionSettings);
    const currentColors = currentPositionSettings?.colors ?? [];
    const currentArrayIndex = currentColors.findIndex((item) => item.index === index);
    let newColors: ColorData[] = [];
    if (currentArrayIndex >= 0) {
      // replace an existing array item
      newColors = [...currentColors];
      newColors.splice(currentArrayIndex, 1, { index, color });
    } else {
      // add to the end of array
      newColors = [...currentColors, { index, color }];
    }
    newMap.set(position, {
      ...currentPositionSettings,
      colors: newColors,
    });
    this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);

    this.positionSettings$.next(newMap);
    this.color$.next({ position, index, color });
  }

  public setColors(colors: ColorData[], position: IconPosition) {
    if (!position) {
      return;
    }

    const currentPositionSettings = this.positionSettings.get(position);
    const newMap = new Map(this.positionSettings);
    newMap.set(position, {
      ...currentPositionSettings,
      colors: [...(colors ?? [])],
    });

    this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);

    this.positionSettings$.next(newMap);
  }

  public clearColors(position = this.position) {
    if (!this.positionSettings.get(position)?.colors?.length) {
      return;
    }

    this.setColors([], position);
  }

  public setLayoutMode(mode: LayoutMode) {
    if (this.layoutMode === mode) {
      return;
    }

    this.position$.next(null);
    this.storageService.set(StorageKey.LabLayoutMode, mode);
    this.layoutMode$.next({ mode, oldMode: this.layoutMode });
  }

  public addToSavedColors(color: string) {
    if (this.savedColors.includes(color)) {
      return;
    }

    const savedColors = [...this.savedColors, color];
    this.storageService.set(StorageKey.LabSavedColors, savedColors);
    this.savedColors$.next(savedColors);
  }

  public removeFromSavedColors(color: string) {
    const savedColors = this.savedColors.filter((item) => item !== color);
    this.storageService.set(StorageKey.LabSavedColors, savedColors);
    this.savedColors$.next(savedColors);
  }

  public replaceSavedColors(colors: string[]) {
    this.storageService.set(StorageKey.LabSavedColors, colors);
    this.savedColors$.next(colors);
  }

  public setSvg(svgBody: SVGSVGElement, position: IconPosition, setFilledElements = false) {
    if (!position) {
      return;
    }

    // if custom colors were previously saved -> fill the icon with them
    const customColorData = this.positionSettings.get(position)?.colors ?? [];
    if (customColorData.length) {
      this.imageService.setIconColors(svgBody, customColorData);
    }

    const filledElements = this.imageService.getFillData(svgBody);
    this.svgBodies.set(position, svgBody.cloneNode(true) as SVGSVGElement);

    if (setFilledElements) {
      this.filledElements$.next(filledElements);
    }
  }

  public exportImage(type: IconType) {
    const hasBackground = !!this.backgroundService.background;
    const artboardSize = ImageHelper.getArtboardSize(hasBackground);

    const wrapperSvg = this.imageService.createSvg(artboardSize);

    this.selectSvgBodies(this.layoutMode).forEach(([position, svgBody]) => {
      const iconSize = this.getIconSize(position);

      // set width & height values of the artboard part (used as a safety check)
      svgBody.setAttribute('width', iconSize.width.toString());
      svgBody.setAttribute('height', iconSize.height.toString());

      // clear grouping data
      svgBody
        .querySelectorAll<SVGElement>(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]:not(g)`)
        .forEach((el) => el.removeAttribute(ImageHelper.DOM_ATTRIBUTES.GROUP_ID));

      // insert any available defs
      const defsEl = svgBody.querySelector('defs');
      if (defsEl) {
        const wrapperSvgDefsEl: SVGGElement = wrapperSvg.querySelector('defs');

        Array.from(defsEl.children).forEach((el) => {
          if (!wrapperSvgDefsEl.querySelector(`[id="${el.id}"]`)) {
            wrapperSvgDefsEl.appendChild(el);
          }
        });
      }

      const svgGroupWrapper = this.imageService.createGroup({
        coordinates: this.getIconCoordinates(position),
        childElement: svgBody,
        size: iconSize,
        rotationAngle: this.getAngle(position),
      });

      // TODO: remove, only for testing. Add bbox rectangles around all parts.
      // const bbox = svgBody.viewBox.baseVal;
      // const rect = this.imageService.createRect({ width: bbox.width, height: bbox.height });
      // svgGroupWrapper.appendChild(rect);

      wrapperSvg.appendChild(svgGroupWrapper);
    });

    // TODO: remove. output merged SVG to the console
    // console.log(wrapperSvg);

    if (type === IconType.Vector) {
      this.imageService.exportSvg(wrapperSvg, this.artboardName);
    } else {
      this.imageService.exportRaster(wrapperSvg, artboardSize.width, artboardSize.height, this.artboardName);
    }
  }

  public getIconSize(position: IconPosition, layoutMode = this.layoutMode): Sizes {
    switch (position) {
      case IconPosition.Center:
        if (layoutMode === LayoutMode.Single) {
          return { width: ImageHelper.SINGLE_ICON_SIZE.width, height: ImageHelper.SINGLE_ICON_SIZE.height };
        } else {
          return { width: ImageHelper.MAIN_ICON_SIZE.width, height: ImageHelper.MAIN_ICON_SIZE.height };
        }

      case IconPosition.Background:
        return { width: ImageHelper.BG_SIZE.width, height: ImageHelper.BG_SIZE.height };

      default:
        return { width: ImageHelper.SUB_ICON_SIZE.width, height: ImageHelper.SUB_ICON_SIZE.height };
    }
  }

  public setAngle(angle: number, position = this.position) {
    if (!position) {
      return;
    }

    const previousAngle = this.positionSettings.get(position)?.rotationAngle;
    if (previousAngle === angle) {
      return;
    }

    const newMap = new Map(this.positionSettings);
    newMap.set(position, { ...newMap.get(position), rotationAngle: angle });
    this.storageService.set(StorageKey.LabPositionSettings, [...newMap]);

    this.positionSettings$.next(newMap);
    this.rotationAngles$.next();
  }

  public getAngle(position = this.position) {
    if (!position) {
      return;
    }

    return this.positionSettings.get(position)?.rotationAngle;
  }

  /**
   * @description The method returns an icon (or a background mapped to icon) based on the selected position.
   * @param position
   * @returns
   */
  public getIcon(position: IconPosition) {
    if (position === IconPosition.Background) {
      return this.backgroundService.backgroundChanged.pipe(
        map((background) => IconHelper.mapBackgroundToIcon(background))
      );
    } else {
      return this.iconsChanged.pipe(map((icons) => icons.get(position)));
    }
  }

  public getIconCoordinates(
    position: IconPosition,
    layoutMode = this.layoutMode,
    artboardSize = ImageHelper.getArtboardSize(!!this.backgroundService.background),
    hasBackground = !!this.backgroundService.background
  ): Coordinates {
    const iconSize = this.getIconSize(position, layoutMode);

    // TODO: add better precision (preview differs from the playground version a little bit)
    // temporarily added delta factor instead
    const delta = -ImageHelper.DELTA;

    // TODO: handle top left & top right positions
    let x = hasBackground ? delta : 0;
    let y = hasBackground ? delta : 0;

    const mainIconCoordinates = () => {
      switch (layoutMode) {
        case LayoutMode.Single:
          x += (artboardSize.width - iconSize.width) / 2;

          if (hasBackground) {
            y += ImageHelper.PADDING_TOP_SINGLE;
          } else {
            y += (artboardSize.height - iconSize.height) / 2;
          }
          break;
        case LayoutMode.BottomLeft:
          if (hasBackground) {
            x +=
              (artboardSize.width - ImageHelper.ARTBOARD_SMALL_SIZE.width) / 2 +
              (ImageHelper.ARTBOARD_SMALL_SIZE.width - iconSize.width);
            y += ImageHelper.PADDING_TOP;
          } else {
            x += artboardSize.width - iconSize.width;
          }
          break;
        case LayoutMode.BottomRight:
          if (hasBackground) {
            x += (artboardSize.width - ImageHelper.ARTBOARD_SMALL_SIZE.width) / 2;
            y += ImageHelper.PADDING_TOP;
          }
          break;
      }

      return { x, y };
    };

    switch (position) {
      case IconPosition.Center:
        return mainIconCoordinates();
      case IconPosition.BottomLeft:
        if (hasBackground) {
          x += (artboardSize.width - ImageHelper.ARTBOARD_SMALL_SIZE.width) / 2;
          y += ImageHelper.ARTBOARD_SMALL_SIZE.height - iconSize.height + ImageHelper.PADDING_TOP;
        } else {
          y += artboardSize.height - iconSize.height;
        }
        break;
      case IconPosition.BottomRight:
        if (hasBackground) {
          x =
            (artboardSize.width - ImageHelper.ARTBOARD_SMALL_SIZE.width) / 2 +
            (ImageHelper.ARTBOARD_SMALL_SIZE.width - iconSize.width);
          y += ImageHelper.ARTBOARD_SMALL_SIZE.height - iconSize.height + ImageHelper.PADDING_TOP;
        } else {
          x += artboardSize.width - iconSize.width;
          y += artboardSize.height - iconSize.height;
        }
        break;
      case IconPosition.Background:
        x = 0;
        y = 0;
        break;
    }

    return { x, y };
  }

  private initCachedData() {
    this.cachedData = {
      settings: this.storageService.getMap<IconPosition, PositionSettings>(StorageKey.LabPositionSettings),
      layoutMode: this.storageService.get<LayoutMode>(StorageKey.LabLayoutMode),
      savedColors: this.storageService.get<string[]>(StorageKey.LabSavedColors),
    };

    if (this.cachedData.layoutMode) {
      this.setLayoutMode(this.cachedData.layoutMode);
    }
    if (this.cachedData.savedColors?.length) {
      this.replaceSavedColors(this.cachedData.savedColors);
    }
    if (this.cachedData.settings?.size) {
      this.setPositionSettings(this.cachedData.settings, false);
    }
  }

  private getAvailablePositions(layoutMode: LayoutMode, excludeBackgroundPosition = false) {
    const availablePositions = excludeBackgroundPosition
      ? [IconPosition.Center]
      : [IconPosition.Background, IconPosition.Center];

    switch (layoutMode) {
      case LayoutMode.Single:
        return availablePositions;
      case LayoutMode.BottomRight:
        return [...availablePositions, IconPosition.BottomRight];
      case LayoutMode.TopRight:
        return [...availablePositions, IconPosition.TopRight];
      case LayoutMode.BottomLeft:
        return [...availablePositions, IconPosition.BottomLeft];
      default:
        return [];
    }
  }

  private setMainIcon(localIcons: Map<IconPosition, IconDto>, apiIcons: IconDto[]) {
    let mainIcon = localIcons.get(IconPosition.Center);
    if (!mainIcon) {
      mainIcon =
        apiIcons.find((icon) => icon.name === 'Calendar') ??
        apiIcons[0] ?? // fetched 'Calendar' icon // any first fetched icon
        null;
      if (mainIcon) {
        this.setIcon(mainIcon, IconPosition.Center);
      }
    }
  }

  private setSubIcon(
    layoutMode: LayoutMode,
    oldLayoutMode: LayoutMode,
    localIcons: Map<IconPosition, IconDto>,
    apiIcons: IconDto[]
  ) {
    const subIconPosition = this.getAvailablePositions(layoutMode, true).find((item) => item !== IconPosition.Center);

    let oldSubIconPosition = this.getAvailablePositions(oldLayoutMode, true).find(
      (item) => item !== IconPosition.Center
    );
    let oldSubIcon = localIcons.get(oldSubIconPosition);
    // if sub item is missing in the previous mode, look for it in other modes
    if (!oldSubIcon) {
      const subItem = [...localIcons].find(([position]) => position !== IconPosition.Center); // any existing sub icon
      oldSubIconPosition = subItem?.[0];
      oldSubIcon = subItem?.[1];
    }

    let subIcon = localIcons.get(subIconPosition);
    if (!subIcon || (!!oldSubIcon && subIcon.id !== oldSubIcon.id)) {
      subIcon =
        oldSubIcon ?? // previous sub item
        apiIcons.find((icon) => icon.name === 'Check') ?? // fetched 'Check' icon
        apiIcons[1] ?? // any second fetched icon
        null;

      if (subIcon) {
        const newSettings: PositionSettings = { ...this.positionSettings.get(oldSubIconPosition), icon: subIcon };
        this.setPositionSetting(newSettings, subIconPosition);
      }

      this.clearPositionSetting(oldSubIconPosition);
    }
  }

  private selectSvgBodies(layoutMode: LayoutMode) {
    const availablePositions = this.getAvailablePositions(layoutMode);
    return availablePositions
      .filter((position) => this.svgBodies.has(position))
      .map((position) => [position, this.svgBodies.get(position)] as [IconPosition, SVGSVGElement])
      .map(([position, svgBody]) => [position, svgBody.cloneNode(true)] as [IconPosition, SVGSVGElement]); // clone data;
  }
}
