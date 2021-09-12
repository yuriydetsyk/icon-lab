import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { first } from 'rxjs/operators';

import { Color } from '../../models/enums/color';
import { StorageKey } from '../../models/enums/storage-key';
import { BackgroundService } from './background.service';
import { StorageService } from './storage.service';

describe('BackgroundService', () => {
  let service: BackgroundService;
  let storageService: StorageService;

  beforeEach(() => {
    const storageServiceStub = () => ({
      set: (key: string, value: any) => ({}),
      getMap: (labIcons: any) => ({}),
      get: (labLayoutMode: any) => null as any,
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackgroundService, { provide: StorageService, useFactory: storageServiceStub }],
    });
    service = TestBed.inject(BackgroundService);
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setBackgroundColor', () => {
    it('should set the background color', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');

      const color = Color.Violet80;
      service.setBackgroundColor(color);

      service.backgroundColorChanged.pipe(first()).subscribe((data) => {
        expect(data).toBe(color);
        expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabBackgroundColor, color);
      });

      tick();
    }));
  });
});
