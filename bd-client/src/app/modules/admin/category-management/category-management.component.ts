import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { forkJoin, merge, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, mergeMap, takeUntil, tap } from 'rxjs/operators';

import { CategoryService } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryDto } from '../../../models/dto/category-dto';
import { ArrayHelper } from '../../../shared/helpers/array.helper';
import { TextHelper } from '../../../shared/helpers/text.helper';

@Component({
  selector: 'bd-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent implements OnDestroy {
  public loading = false;
  public form = new FormArray([]);
  public categories$ = this.fetchCategories();
  public notifications$ = this.notificationService.notificationsChanged;
  public get categoryForms() {
    return this.form.controls as FormGroup[];
  }
  public isAddingCategory = false;
  public isDeleting = false;
  public newCategoryForm = this.fb.group({
    name: [null, Validators.required],
    description: [null],
  });
  public deleteCategoryControl = this.fb.control([null, Validators.required]);
  private destroyed$ = new Subject<void>();
  private readonly COMPONENT_TITLE = 'Category Management';

  constructor(
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly clipboardService: ClipboardService
  ) {}

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getInputCss(categoryFieldControl: AbstractControl) {
    const cssClass = 'w-100 text-small';
    return categoryFieldControl.invalid ? `${cssClass} is-invalid` : cssClass;
  }

  public cancelAddingCategory() {
    this.isAddingCategory = false;
    this.newCategoryForm.reset();
  }

  public addCategory() {
    if (this.newCategoryForm.invalid) {
      return;
    }

    this.loading = true;
    this.categoryService
      .addCategory(this.newCategoryForm.value)
      .pipe(
        mergeMap(() => this.fetchCategories()),
        tap(() => {
          this.addNotification({ name: this.newCategoryForm.value.name }, 'added');
          this.newCategoryForm.reset();
        })
      )
      .subscribe();

    this.isAddingCategory = false;
  }

  public openDeleteModal(category: CategoryDto) {
    this.deleteCategoryControl.setValue(category);
    this.isDeleting = true;
  }

  public deleteCategory() {
    this.loading = true;
    this.categoryService
      .deleteCategory(this.deleteCategoryControl.value.id)
      .pipe(
        mergeMap(() => this.fetchCategories()),
        tap(() => {
          this.addNotification({ name: this.deleteCategoryControl.value.name }, 'deleted');
          this.deleteCategoryControl.reset();
        })
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

  private fetchCategories() {
    this.loading = true;

    return this.categoryService.getCategories(true).pipe(
      map((categories) => ArrayHelper.sortAlphaNumeric(categories, 'name')),
      tap((categories) => this.createForm(categories)),
      finalize(() => (this.loading = false))
    );
  }

  private createForm(categories: CategoryDto[]) {
    this.form.clear();

    categories.forEach((i) => {
      const group = this.fb.group({
        id: [i.id, Validators.required],
        name: [i.name, Validators.required],
        description: [i.description, Validators.required],
        createdAt: [i.createdAt, Validators.required],
        updatedAt: [i.updatedAt],
      });
      merge(
        group.get('name').valueChanges.pipe(map((val) => ({ name: val }))),
        group.get('description').valueChanges.pipe(map((val) => ({ description: val })))
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
            return (x as any)[key] === (y as any)[key];
          }),
          map((changes) => ({ id: i.id, ...changes } as Partial<CategoryDto>)),
          mergeMap((category) => forkJoin([of(category), this.categoryService.patchCategory(category)])),
          tap(([updatedCategory]) => {
            const updatedCategoryFull = categories.find((item) => item.id === updatedCategory.id);
            if (updatedCategoryFull) {
              this.addNotification({ ...updatedCategoryFull, ...updatedCategory }, 'updated');
            }

            this.categories$ = this.fetchCategories();
          })
        )
        .subscribe();

      this.form.push(group);
    });
  }

  private addNotification(category: Partial<CategoryDto>, action: 'added' | 'updated' | 'deleted') {
    this.notificationService.addNotification({
      title: this.COMPONENT_TITLE,
      body: `Category '${category.name}' has been ${action}.`,
    });
  }
}
