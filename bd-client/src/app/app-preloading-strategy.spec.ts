import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { AppPreloadingStrategy } from './app-preloading-strategy';

describe('AppPreloadingStrategy', () => {
  let service: AppPreloadingStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AppPreloadingStrategy] });
    service = TestBed.inject(AppPreloadingStrategy);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('preload', () => {
    it('should preload a route with truthy "preload" property', fakeAsync(() => {
      const expected = true;
      const loadFn = () => of(true);
      service
        .preload({ data: { preload: expected } }, loadFn)
        .pipe(first())
        .subscribe((res) => {
          expect(res).toBe(expected);
        });

      tick();
    }));

    it('should not preload a route with falsy "preload" property', fakeAsync(() => {
      const expected: boolean = null;
      const loadFn = () => of(true);
      service
        .preload({ data: { preload: expected } }, loadFn)
        .pipe(first())
        .subscribe((res) => {
          expect(res).toBe(expected);
        });

      tick();
    }));

    it('should not preload a route with missing "preload" property', fakeAsync(() => {
      const expected: boolean = null;
      const loadFn = () => of(true);
      service
        .preload({}, loadFn)
        .pipe(first())
        .subscribe((res) => {
          expect(res).toBe(expected);
        });

      tick();
    }));
  });
});
