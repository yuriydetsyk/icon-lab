import { TestBed } from '@angular/core/testing';
import { KebabCasePipe } from './kebab-case.pipe';

describe('KebabCasePipe', () => {
  let pipe: KebabCasePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [KebabCasePipe] });
    pipe = TestBed.inject(KebabCasePipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms string to kebab-case', () => {
    const value = 'TestingStringValue';
    expect(pipe.transform(value)).toEqual('testing-string-value');
  });
});
