import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, refCount, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IconDto } from '../../models/dto/icon-dto';
import { SearchFilters } from '../../models/interfaces/search-filters';
import { DataHelper } from '../../shared/helpers/data.helper';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private getIcons$: Observable<IconDto[]>;
  private filters: SearchFilters;

  constructor(private readonly httpClient: HttpClient) {}

  public getIconFilters() {
    return this.filters;
  }

  public getIcons(filters: SearchFilters = {}, forceReload = false) {
    filters = DataHelper.removeEmpty(filters);

    // if nothing has changed => return pending request, so we don't create extra ones
    if (!forceReload && this.getIcons$ && DataHelper.isEqual(this.filters, filters)) {
      return this.getIcons$;
    }

    let params = new HttpParams();
    if (filters.keyword) {
      params = params.set('keyword', filters.keyword);
    }
    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }

    this.filters = filters;
    this.getIcons$ = this.httpClient
      .get<IconDto[]>(`${environment.apiUrl}/icons`, { params })
      .pipe(shareReplay({ refCount: true }));

    return this.getIcons$;
  }

  public uploadIcons(body: FormData) {
    return this.httpClient.post<void>(`${environment.apiUrl}/icons`, body);
  }

  public patchIcon(icon: Partial<IconDto>) {
    return this.httpClient.patch<void>(`${environment.apiUrl}/icons`, { icon });
  }

  public deleteIcon(iconId: string) {
    return this.httpClient.delete<void>(`${environment.apiUrl}/icons/${iconId}`);
  }

  public addIconCategory(iconId: string, categoryId: string) {
    return this.httpClient.post<void>(`${environment.apiUrl}/categories/${categoryId}/${iconId}`, { iconId });
  }

  public deleteIconCategory(iconId: string, categoryId: string) {
    return this.httpClient.delete<void>(`${environment.apiUrl}/categories/${categoryId}/${iconId}`);
  }

  public parseSvg(fileName: string, isBackground = false) {
    return this.httpClient
      .post(`${environment.apiUrl}/icons/parse-svg`, { fileName, isBackground }, { responseType: 'text' })
      .pipe(map((text) => new DOMParser().parseFromString(text, 'image/svg+xml')?.querySelector('svg')));
  }

  public parseRaster(fileName: string) {
    return this.httpClient.post<{ base64: string }>(`${environment.apiUrl}/icons/parse-raster`, { fileName });
  }
}
