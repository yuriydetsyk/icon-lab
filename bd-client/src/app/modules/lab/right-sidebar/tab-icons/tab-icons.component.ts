import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, mergeMap, takeUntil } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../../../core/services/category.service';
import { IconService } from '../../../../core/services/icon.service';
import { LabService } from '../../../../core/services/lab.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { IconDto } from '../../../../models/dto/icon-dto';
import { DataHelper } from '../../../../shared/helpers/data.helper';
import { TextHelper } from '../../../../shared/helpers/text.helper';

@Component({
  selector: 'bd-tab-icons',
  templateUrl: './tab-icons.component.html',
  styleUrls: ['./tab-icons.component.scss'],
})
export class TabIconsComponent implements OnInit, OnDestroy {
  public searchForm = this.fb.group({
    keyword: this.iconService.getIconFilters().keyword,
    categoryId: this.iconService.getIconFilters().categoryId,
  });
  public get keyword() {
    return this.searchForm.controls.keyword;
  }
  public get categoryId() {
    return this.searchForm.controls.categoryId;
  }
  public destroyed$ = new Subject<void>();
  public icons$ = merge(
    this.iconService.getIcons(this.searchForm.value),
    merge(
      this.keyword.valueChanges.pipe(
        takeUntil(this.destroyed$),
        filter((keyword: string) => !keyword || keyword.length !== 1),
        debounceTime(TextHelper.DEFAULT_DEBOUNCE_TIME),
        distinctUntilChanged()
      ),
      this.categoryId.valueChanges.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
    ).pipe(
      delay(0), // wait until `this.searchForm` gets an updated value
      mergeMap(() => this.iconService.getIcons(this.searchForm.value))
    )
  );
  public loading = false;
  public categories$ = this.categoryService.getCategories();
  public DataHelper = DataHelper;

  constructor(
    private readonly iconService: IconService,
    private readonly categoryService: CategoryService,
    private readonly loadingService: LoadingService,
    private readonly labService: LabService,
    private readonly fb: FormBuilder
  ) {}

  public ngOnInit() {
    this.loadingService.loadingSub
      .pipe(takeUntil(this.destroyed$), delay(0))
      .subscribe(
        (loading) => (this.loading = loading && this.loadingService.loadingMap.has(`${environment.apiUrl}/icons`))
      );
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public trackIconsFn(_: number, item: IconDto) {
    return item.id;
  }

  public setIcon(icon: IconDto) {
    this.labService.setIcon(icon);
  }
}
