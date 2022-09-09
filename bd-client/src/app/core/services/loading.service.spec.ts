import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LoadingService] });
    service = TestBed.inject(LoadingService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('setLoading', () => {
    it('should enable/disable loading for a selected URL', () => {
      const loadingSubSpy = jest.spyOn(service.loadingSub, 'next');
      const url = 'test-url';
      let state = true;
      service.setLoading(state, url);

      expect(loadingSubSpy).toHaveBeenCalledWith(state);
      expect(service.loadingMap.get(url)).toBe(state);

      state = false;
      service.setLoading(state, url);

      expect(loadingSubSpy).toHaveBeenCalledTimes(2);
      expect(loadingSubSpy).toHaveBeenCalledWith(state);
      expect(service.loadingMap.size).toBe(0);
    });

    it('should not toggle loading, if the URL has not been passed', () => {
      expect(() => service.setLoading(true, null)).toThrowError();
    });
  });
});
