import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Color } from '../../../models/enums/color';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ColorPickerComponent],
    });
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`active has default value`, () => {
    expect(component.active).toEqual(false);
  });

  it(`hover has default value`, () => {
    expect(component.hover).toEqual(false);
  });

  it(`colorPickerOpened has default value`, () => {
    expect(component.colorPickerOpened).toEqual(false);
  });

  it(`fallbackColor has default value`, () => {
    expect(component.fallbackColor).toEqual(Color.White);
  });
});
