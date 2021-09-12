import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { BackgroundDto } from '../../models/dto/background-dto';
import { Color } from '../../models/enums/color';
import { StorageKey } from '../../models/enums/storage-key';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  public get background() {
    return this.background$.value;
  }
  public get backgroundChanged() {
    return this.background$.asObservable();
  }
  public get backgroundColorChanged() {
    return this.backgroundColor$.asObservable();
  }

  private getBackgrounds$: Observable<BackgroundDto[]>;
  private background$ = new BehaviorSubject<BackgroundDto>(null);
  private backgroundColor$ = new BehaviorSubject<string>(Color.Background);
  private cachedData: {
    background: BackgroundDto;
    backgroundColor: string;
  };

  constructor(private readonly httpClient: HttpClient, private readonly storageService: StorageService) {
    this.initCachedData();
  }

  public getBackgrounds(forceReload = false) {
    // if nothing has changed => return pending request, so we don't create extra ones
    if (!forceReload && this.getBackgrounds$) {
      return this.getBackgrounds$;
    }

    this.getBackgrounds$ = this.httpClient
      .get<BackgroundDto[]>(`${environment.apiUrl}/backgrounds`)
      .pipe(shareReplay({ refCount: true }));

    return this.getBackgrounds$;
  }

  public setBackground(background: BackgroundDto) {
    if (background?.id === this.background?.id) {
      return;
    }

    this.storageService.set(StorageKey.LabBackground, background ? { ...background } : null);
    this.background$.next(background);
  }

  public setBackgroundColor(color: string) {
    this.backgroundColor$.next(color);
    this.storageService.set(StorageKey.LabBackgroundColor, color);
  }

  public patchBackground(bg: Partial<BackgroundDto>) {
    return this.httpClient.patch<void>(`${environment.apiUrl}/backgrounds`, { bg });
  }

  public deleteBackground(backgroundId: string) {
    return this.httpClient.delete<void>(`${environment.apiUrl}/backgrounds/${backgroundId}`);
  }

  public uploadBackgrounds(body: FormData) {
    return this.httpClient.post<void>(`${environment.apiUrl}/backgrounds`, body);
  }

  private initCachedData() {
    this.cachedData = {
      background: this.storageService.get<BackgroundDto>(StorageKey.LabBackground),
      backgroundColor: this.storageService.get<string>(StorageKey.LabBackgroundColor),
    };

    if (this.cachedData.background) {
      this.setBackground(this.cachedData.background);
    }
    if (this.cachedData.backgroundColor) {
      this.setBackgroundColor(this.cachedData.backgroundColor);
    }
  }
}
