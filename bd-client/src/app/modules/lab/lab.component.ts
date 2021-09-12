import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { delay, filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { BackgroundService } from '../../core/services/background.service';
import { LabService } from '../../core/services/lab.service';
import { LayoutService } from '../../core/services/layout.service';
import { IconType } from '../../models/enums/icon-type';

@Component({
  selector: 'bd-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss'],
})
export class LabComponent implements OnInit, OnDestroy {
  public selectedIcon$ = this.labService.positionChanged.pipe(
    switchMap((position) => this.labService.getIcon(position))
  );
  public hasSelectedIcon$ = this.selectedIcon$.pipe(map((icon) => !!icon));
  public hasSelectedVectorIcon$ = this.selectedIcon$.pipe(map((icon) => icon?.type === IconType.Vector));
  public hasBackgroundPosition$ = this.labService.hasBackgroundPosition$;
  public savedColors$ = this.labService.savedColorsChanged;
  public get selectedColorControls() {
    return this.selectedColors.controls as FormControl[];
  }
  public iconName = new FormControl();
  public backgroundColor$ = this.backgroundService.backgroundColorChanged;
  // we cannot use [class.xxx] binding in the right sidebar, as we deal with the host element there
  public hasOpenedRightSidebar$ = this.layoutService.openedRightSidebar.pipe(delay(0));
  private selectedColors = new FormArray([]);
  private destroyed$ = new Subject<void>();
  private unselectPositionListenerFn: () => void;

  constructor(
    private readonly labService: LabService,
    private readonly backgroundService: BackgroundService,
    private readonly layoutService: LayoutService,
    private readonly renderer: Renderer2
  ) {}

  public ngOnInit() {
    this.labService.filledElementsChanged
      .pipe(
        takeUntil(this.destroyed$),
        filter((filledElements) => !!filledElements)
      )
      .subscribe((filledElements) => {
        this.selectedColors.clear();

        filledElements.forEach(({ color, index }) => {
          const contol = new FormControl(color);

          this.selectedColors.push(contol);
          this.initColorListener(contol, index);
        });
      });

    this.labService.iconChanged.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.labService.clearColors();
    });

    this.initIconNameHandler();

    this.unselectPositionListenerFn = this.renderer.listen('window', 'keydown.escape', () => {
      this.labService.unsetPosition();
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.unselectPositionListenerFn();
  }

  public addToSaved(color: string) {
    this.labService.addToSavedColors(color);
  }

  public removeFromSaved(color: string) {
    this.labService.removeFromSavedColors(color);
  }

  public replaceSaved(colors: string[]) {
    this.labService.replaceSavedColors(colors);
  }

  public setBackgroundColor(color: string) {
    this.backgroundService.setBackgroundColor(color);
  }

  private initColorListener(control: FormControl, index: string) {
    control.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((color: string) => this.labService.setColor(color, index));
  }

  private initIconNameHandler() {
    this.iconName.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((iconName) => (this.labService.artboardName = iconName));
    this.iconName.setValue('icon-name');
  }
}
