import { TestBed } from '@angular/core/testing';
import { FormatBytesPipe } from './format-bytes.pipe';

describe('FormatBytesPipe', () => {
  let pipe: FormatBytesPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FormatBytesPipe] });
    pipe = TestBed.inject(FormatBytesPipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms X to Y', () => {
    const value = 1080;
    const decimals = 2;
    expect(pipe.transform(value, decimals)).toEqual('1.05 KB');
  });
});
