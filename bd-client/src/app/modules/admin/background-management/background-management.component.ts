import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { forkJoin, merge, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { BackgroundService } from '../../../core/services/background.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BackgroundDto } from '../../../models/dto/background-dto';
import { ArrayHelper } from '../../../shared/helpers/array.helper';
import { DataHelper } from '../../../shared/helpers/data.helper';
import { TextHelper } from '../../../shared/helpers/text.helper';

@Component({
  selector: 'bd-background-management',
  templateUrl: './background-management.component.html',
  styleUrls: ['./background-management.component.scss'],
})
export class BackgroundManagementComponent implements OnDestroy {
  public loading = false;
  public form = new FormArray([]);
  public backgrounds$ = this.fetchBackgrounds();
  public notifications$ = this.notificationService.notificationsChanged;
  public get backgroundForms() {
    return this.form.controls as FormGroup[];
  }
  public isDeleting = false;
  public deleteBackgroundControl = this.fb.control([null, Validators.required]);
  private destroyed$ = new Subject<void>();
  private readonly COMPONENT_TITLE = 'Background Management';

  constructor(
    private readonly backgroundService: BackgroundService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly clipboardService: ClipboardService
  ) {}

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getInputCss(backgroundFieldControl: AbstractControl) {
    const cssClass = 'w-100 text-small';
    return backgroundFieldControl.invalid ? `${cssClass} is-invalid` : cssClass;
  }

  public openDeleteModal(background: BackgroundDto) {
    this.deleteBackgroundControl.setValue(background);
    this.isDeleting = true;
  }

  public deleteBackground() {
    this.loading = true;
    this.backgroundService
      .deleteBackground(this.deleteBackgroundControl.value.id)
      .pipe(
        mergeMap(() => this.backgrounds$),
        tap((backgrounds) => {
          this.localDelete(this.deleteBackgroundControl.value.id, backgrounds);
          this.addNotification({ name: this.deleteBackgroundControl.value.name }, 'deleted');
          this.deleteBackgroundControl.reset();
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe();

    this.isDeleting = false;
  }

  public copyId(id: string) {
    this.clipboardService.copy(id);
    this.notificationService.addNotification({
      title: this.COMPONENT_TITLE,
      body: `Id '${id}' has been copied to clipboard.`,
    });
  }

  private fetchBackgrounds() {
    this.loading = true;

    return this.backgroundService.getBackgrounds(true).pipe(
      map((backgrounds) => ArrayHelper.sortAlphaNumeric(backgrounds, 'name')),
      tap((backgrounds) => this.createForm(backgrounds)),
      finalize(() => (this.loading = false))
    );
  }

  private createForm(backgrounds: BackgroundDto[]) {
    this.form.clear();

    backgrounds.forEach((i) => {
      const group = this.fb.group({
        id: [i.id, Validators.required],
        name: [i.name, Validators.required],
        tags: [i.tags],
        url: [i.url, Validators.required],
        createdAt: [i.createdAt, Validators.required],
        updatedAt: [i.updatedAt],
      });
      merge(
        group.get('name').valueChanges.pipe(map((val) => ({ name: val }))),
        group.get('tags').valueChanges.pipe(
          map((val) => ({
            tags: val
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => !!tag.length),
          }))
        ),
        group.get('url').valueChanges.pipe(map((val) => ({ url: val })))
      )
        .pipe(
          takeUntil(this.destroyed$),
          filter(() => {
            group.updateValueAndValidity();
            return group.valid;
          }),
          debounceTime(TextHelper.DEFAULT_DEBOUNCE_TIME),
          distinctUntilChanged((x, y) => {
            const key = Object.keys(y)[0];
            const oldVal = (x as any)[key];
            const newVal = (y as any)[key];
            const isArray = Array.isArray(oldVal);
            return isArray ? DataHelper.isEqual(oldVal, newVal) : oldVal === newVal;
          }),
          map((changes) => ({ id: i.id, ...changes } as Partial<BackgroundDto>)),
          mergeMap((background) => forkJoin([of(background), this.backgroundService.patchBackground(background)])),
          tap(([updatedBackground]) => {
            this.localUpdate(updatedBackground, backgrounds);
            const updatedBackgroundFull = backgrounds.find((item) => item.id === updatedBackground.id);
            if (updatedBackgroundFull) {
              this.addNotification({ ...updatedBackgroundFull, ...updatedBackground }, 'updated');
            }
          })
        )
        .subscribe();

      this.form.push(group);
    });
  }

  private localUpdate(updatedBackground: Partial<BackgroundDto>, backgrounds: BackgroundDto[]) {
    const clonedBackgrounds = [...backgrounds];
    const index = clonedBackgrounds.findIndex((background) => background.id === updatedBackground.id);
    clonedBackgrounds[index] = { ...clonedBackgrounds[index], ...updatedBackground };
    this.backgrounds$ = of(clonedBackgrounds);
  }

  private localDelete(backgroundId: string, backgrounds: BackgroundDto[]) {
    this.backgrounds$ = of([...backgrounds.filter((background) => background.id !== backgroundId)]).pipe(
      tap(() => {
        const controlIndex = this.form.controls.findIndex((c) => c.value.id === backgroundId);
        if (controlIndex) {
          this.form.removeAt(controlIndex);
        }
      })
    );
  }

  private addNotification(background: Partial<BackgroundDto>, action: 'updated' | 'deleted') {
    this.notificationService.addNotification({
      title: this.COMPONENT_TITLE,
      body: `Background '${background.name}' has been ${action}.`,
    });
  }
}
