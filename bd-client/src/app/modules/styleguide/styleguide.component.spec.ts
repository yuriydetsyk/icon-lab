import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IconService } from '../../core/services/icon.service';
import { StyleguideComponent } from './styleguide.component';

describe('StyleguideComponent', () => {
  let component: StyleguideComponent;
  let fixture: ComponentFixture<StyleguideComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object: any) => ({}) });
    const iconServiceStub = () => ({
      getIcons: () => of([]),
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [StyleguideComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: IconService, useFactory: iconServiceStub },
      ],
    });
    fixture = TestBed.createComponent(StyleguideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`tabs has default value`, () => {
    expect(component.tabs.length).toEqual(3);
  });

  it(`icons has default value`, () => {
    expect(component.icons).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub = TestBed.inject(FormBuilder);
      const iconServiceStub = TestBed.inject(IconService);
      jest.spyOn(formBuilderStub, 'group');
      jest.spyOn(iconServiceStub, 'getIcons');
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
      expect(iconServiceStub.getIcons).toHaveBeenCalled();
    });
  });
});
