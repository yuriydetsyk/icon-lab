import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { forkJoin, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { CategoryService } from '../../../core/services/category.service';
import { IconService } from '../../../core/services/icon.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryDto } from '../../../models/dto/category-dto';
import { IconDto } from '../../../models/dto/icon-dto';
import { IconType } from '../../../models/enums/icon-type';
import { ArrayHelper } from '../../../shared/helpers/array.helper';
import { DataHelper } from '../../../shared/helpers/data.helper';
import { TextHelper } from '../../../shared/helpers/text.helper';

@Component({
  selector: 'bd-icon-management',
  templateUrl: './icon-management.component.html',
  styleUrls: ['./icon-management.component.scss'],
})
export class IconManagementComponent implements OnDestroy {
  public loading = false;
  public form = new FormArray([]);
  public icons$ = this.fetchIcons();
  public IconType = IconType;
  public iconTypes = Object.entries(IconType).map(([key, value]) => ({ id: value, name: key }));
  public categories$ = this.categoryService.getCategories();
  public notifications$ = this.notificationService.notificationsChanged;
  public get iconForms() {
    return this.form.controls as FormGroup[];
  }
  public isDeleting = false;
  public deleteIconControl = this.fb.control([null, Validators.required]);
  private destroyed$ = new Subject<void>();
  private readonly COMPONENT_TITLE = 'Icon Management';

  constructor(
    private readonly iconService: IconService,
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly clipboardService: ClipboardService
  ) {}

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getIconType(type: IconType) {
    switch (type) {
      case IconType.Raster:
        return 'Raster';
      case IconType.Vector:
        return 'Vector';
      default:
        return '-';
    }
  }

  public hasCategory(icon: IconDto, category: CategoryDto) {
    return icon.categories?.some((cat) => cat.id === category.id);
  }

  public toggleCategory(icon: IconDto, category: CategoryDto, iconControl: FormGroup) {
    let updatedIcon: Partial<IconDto>;
    let obs$: Observable<any>;

    if (this.hasCategory(icon, category)) {
      updatedIcon = { id: icon.id, categories: icon.categories.filter((cat) => cat.id !== category.id) };
      obs$ = this.iconService.deleteIconCategory(icon.id, category.id);
    } else {
      updatedIcon = { id: icon.id, categories: [...icon.categories, category] };
      obs$ = this.iconService.addIconCategory(icon.id, category.id);
    }

    return obs$.pipe(tap(() => iconControl.get('categories').setValue(updatedIcon.categories))).subscribe();
  }

  public getInputCss(iconFieldControl: AbstractControl) {
    const cssClass = 'w-100 text-small';
    return iconFieldControl.invalid ? `${cssClass} is-invalid` : cssClass;
  }

  public openDeleteModal(icon: IconDto) {
    this.deleteIconControl.setValue(icon);
    this.isDeleting = true;
  }

  public deleteIcon() {
    this.loading = true;
    this.iconService
      .deleteIcon(this.deleteIconControl.value.id)
      .pipe(
        mergeMap(() => this.icons$),
        tap((icons) => {
          this.localDelete(this.deleteIconControl.value.id, icons);
          this.addNotification({ name: this.deleteIconControl.value.name }, 'deleted');
          this.deleteIconControl.reset();
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

  private fetchIcons() {
    this.loading = true;

    return this.iconService.getIcons({}, true).pipe(
      map((icons) => ArrayHelper.sortAlphaNumeric(icons, 'name')),
      tap((icons) => this.createForm(icons)),
      finalize(() => (this.loading = false))
    );
  }

  private createForm(icons: IconDto[]) {
    this.form.clear();

    icons.forEach((i) => {
      const group = this.fb.group({
        id: [i.id, Validators.required],
        name: [i.name, Validators.required],
        tags: [i.tags],
        url: [i.url, Validators.required],
        type: [i.type, Validators.required],
        isPremium: [i.isPremium, Validators.required],
        categories: [i.categories],
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
        group.get('url').valueChanges.pipe(map((val) => ({ url: val }))),
        group.get('type').valueChanges.pipe(map((val) => ({ type: val }))),
        group.get('isPremium').valueChanges.pipe(map((val) => ({ isPremium: val })))
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
          map((changes) => ({ id: i.id, ...changes } as Partial<IconDto>)),
          mergeMap((icon) => forkJoin([of(icon), this.iconService.patchIcon(icon)])),
          tap(([updatedIcon]) => {
            this.localUpdate(updatedIcon, icons);
            const updatedIconFull = icons.find((item) => item.id === updatedIcon.id);
            if (updatedIconFull) {
              this.addNotification({ ...updatedIconFull, ...updatedIcon }, 'updated');
            }
          })
        )
        .subscribe();

      group
        .get('categories')
        .valueChanges.pipe(map((val) => ({ categories: val })))
        .pipe(
          // TODO: reuse shared pipe elements
          takeUntil(this.destroyed$),
          map((changes) => ({ id: i.id, ...changes } as Partial<IconDto>)),
          tap((updatedIcon) => {
            this.localUpdate(updatedIcon, icons);
            const updatedIconFull = icons.find((item) => item.id === updatedIcon.id);
            if (updatedIconFull) {
              this.addNotification({ ...updatedIconFull, ...updatedIcon }, 'updated');
            }
          })
        )
        .subscribe();

      this.form.push(group);
    });
  }

  private localUpdate(updatedIcon: Partial<IconDto>, icons: IconDto[]) {
    const clonedIcons = [...icons];
    const index = clonedIcons.findIndex((icon) => icon.id === updatedIcon.id);
    clonedIcons[index] = { ...clonedIcons[index], ...updatedIcon };
    this.icons$ = of(clonedIcons);
  }

  private localDelete(iconId: string, icons: IconDto[]) {
    this.icons$ = of([...icons.filter((icon) => icon.id !== iconId)]).pipe(
      tap(() => {
        const controlIndex = this.form.controls.findIndex((c) => c.value.id === iconId);
        if (controlIndex) {
          this.form.removeAt(controlIndex);
        }
      })
    );
  }

  private addNotification(icon: Partial<IconDto>, action: 'updated' | 'deleted') {
    this.notificationService.addNotification({
      title: this.COMPONENT_TITLE,
      body: `Icon '${icon.name}' has been ${action}.`,
    });
  }
}
