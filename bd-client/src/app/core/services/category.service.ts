import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CategoryDto } from '../../models/dto/category-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private getCategories$: Observable<CategoryDto[]>;

  constructor(private readonly httpClient: HttpClient) {}

  public getCategories(forceReload = false) {
    if (this.getCategories$ && !forceReload) {
      return this.getCategories$;
    }

    this.getCategories$ = this.httpClient
      .get<CategoryDto[]>(`${environment.apiUrl}/categories`)
      .pipe(shareReplay(1), shareReplay({ refCount: true }));
    return this.getCategories$;
  }

  public patchCategory(category: Partial<CategoryDto>) {
    return this.httpClient.patch<void>(`${environment.apiUrl}/categories`, { category });
  }

  public addCategory(category: CategoryDto) {
    return this.httpClient.post<CategoryDto>(`${environment.apiUrl}/categories`, { category });
  }

  public deleteCategory(categoryId: string) {
    return this.httpClient.delete<void>(`${environment.apiUrl}/categories/${categoryId}`);
  }
}
