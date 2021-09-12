import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CategoryDto } from '../../models/dto/category-dto';
import { SearchFilters } from '../../models/interfaces/search-filters';
import { IconService } from './icon.service';

describe('IconService', () => {
  let service: IconService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IconService],
    });
    service = TestBed.inject(IconService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getIconFilters', () => {
    it('should get default empty search filters', () => {
      expect(service.getIconFilters()).toBeUndefined();
    });

    it('should get the recent search filters', fakeAsync(() => {
      const filters: SearchFilters = { keyword: 'test', categoryId: '1' };
      service.getIcons(filters).subscribe(() => {
        expect(service.getIconFilters()).toEqual(filters);
      });

      const req = httpMock.expectOne((request) => request.params.get('keyword') === filters.keyword);

      req.flush([]);
      tick();
    }));
  });

  describe('getIcons', () => {
    afterEach(() => httpMock.verify());

    it('should get icons without any filters', () => {
      service.getIcons().subscribe();

      const req = httpMock.expectOne((request) => request.params.keys().length === 0);
      expect(req.request.method).toBe('GET');
    });

    it('should get icons with filters', () => {
      const filters: SearchFilters = { keyword: 'test', categoryId: '1' };
      service.getIcons(filters).subscribe();

      const req = httpMock.expectOne(
        (request) =>
          request.params.get('keyword') === filters.keyword && request.params.get('categoryId') === filters.categoryId
      );
      expect(req.request.method).toBe('GET');
    });
  });
});
