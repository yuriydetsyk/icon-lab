import { TestBed } from '@angular/core/testing';

import { IconStyleService } from './icon-style.service';

describe('IconStyleService', () => {
  let service: IconStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
