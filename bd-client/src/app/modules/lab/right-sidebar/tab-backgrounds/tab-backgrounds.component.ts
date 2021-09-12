import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { BackgroundService } from '../../../../core/services/background.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { BackgroundDto } from '../../../../models/dto/background-dto';
import { DataHelper } from '../../../../shared/helpers/data.helper';
import { IconHelper } from '../../../../shared/helpers/icon.helper';

@Component({
  selector: 'bd-tab-backgrounds',
  templateUrl: './tab-backgrounds.component.html',
  styleUrls: ['./tab-backgrounds.component.scss'],
})
export class TabBackgroundsComponent implements OnInit, OnDestroy {
  public destroyed$ = new Subject<void>();
  public backgrounds$ = this.backgroundService.getBackgrounds();
  public loading = false;
  public IconHelper = IconHelper;
  public DataHelper = DataHelper;

  constructor(private readonly loadingService: LoadingService, private readonly backgroundService: BackgroundService) {}

  public ngOnInit() {
    this.loadingService.loadingSub
      .pipe(takeUntil(this.destroyed$), delay(0))
      .subscribe(
        (loading) => (this.loading = loading && this.loadingService.loadingMap.has(`${environment.apiUrl}/backgrounds`))
      );
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public trackBackgroundsFn(_: number, item: BackgroundDto) {
    return item.id;
  }

  public setBackground(background: BackgroundDto) {
    this.backgroundService.setBackground(background);
  }

  // TODO: improve
  public clearBackground() {
    this.backgroundService.setBackground(null);
  }
}
