import { HttpHandler, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoadingService } from '../services/loading.service';
import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let service: LoadingInterceptor;

  beforeEach(() => {
    const loadingServiceStub = () => ({ setLoading: (arg: any, url: any) => ({}) });
    TestBed.configureTestingModule({
      providers: [LoadingInterceptor, { provide: LoadingService, useFactory: loadingServiceStub }],
    });
    service = TestBed.inject(LoadingInterceptor);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    it('makes expected calls', () => {
      const httpHandlerStub: HttpHandler = { handle: () => of() } as any;
      const httpRequestStub: HttpRequest<any> = { url: 'testurl' } as any;
      const loadingServiceStub: LoadingService = TestBed.inject(LoadingService);
      spyOn(httpHandlerStub, 'handle').and.callThrough();
      spyOn(loadingServiceStub, 'setLoading').and.callThrough();
      service.intercept(httpRequestStub, httpHandlerStub);
      expect(httpHandlerStub.handle).toHaveBeenCalled();
      expect(loadingServiceStub.setLoading).toHaveBeenCalledWith(true, httpRequestStub.url);
    });
  });
});
