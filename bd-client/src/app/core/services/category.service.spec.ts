import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CategoryDto } from '../../models/dto/category-dto';

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategories', () => {
    afterEach(() => httpMock.verify());

    it('should get icon categories', fakeAsync(() => {
      const categories: CategoryDto[] = [
        { id: '1', name: 'Cat 1', createdAt: new Date() },
        { id: '2', name: 'Cat 2', description: 'Cat 2 description', createdAt: new Date() },
      ];
      service.getCategories().subscribe((data) => {
        expect(data).toEqual(categories);
      });

      const req = httpMock.expectOne((request) => request.url.includes('categories'));
      expect(req.request.method).toBe('GET');

      req.flush(categories);
      tick();
    }));

    it('should cache icon categories', fakeAsync(() => {
      const categories: CategoryDto[] = [
        { id: '1', name: 'Cat 1', createdAt: new Date() },
        { id: '2', name: 'Cat 2', description: 'Cat 2 description', createdAt: new Date() },
      ];
      service.getCategories().subscribe((data) => {
        expect(data).toEqual(categories);
      });
      service.getCategories().subscribe((data) => {
        expect(data).toEqual(categories);
      });

      const req = httpMock.expectOne((request) => request.url.includes('categories'));
      expect(req.request.method).toBe('GET');

      req.flush(categories);
      tick();
    }));
  });
});
