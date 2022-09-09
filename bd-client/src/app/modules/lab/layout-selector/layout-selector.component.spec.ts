import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LabService } from '../../../core/services/lab.service';
import { LayoutMode } from '../../../models/enums/layout-mode';
import { LayoutSelectorComponent } from './layout-selector.component';
import { of } from 'rxjs';

describe('LayoutSelectorComponent', () => {
  let component: LayoutSelectorComponent;
  let fixture: ComponentFixture<LayoutSelectorComponent>;

  beforeEach(() => {
    const labServiceStub = () => ({
      setLayoutMode: (mode: any) => ({}),
      layoutModeChanged: of(LayoutMode.Single),
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LayoutSelectorComponent],
      providers: [{ provide: LabService, useFactory: labServiceStub }],
    });
    fixture = TestBed.createComponent(LayoutSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`layoutModes has default value`, () => {
    expect(component.layoutModes.length).toBe(3);
  });

  describe('setMode', () => {
    it('makes expected calls', () => {
      const labServiceStub = TestBed.inject(LabService);
      const layoutModeStub = LayoutMode.Single;
      jest.spyOn(labServiceStub, 'setLayoutMode');
      component.setMode(layoutModeStub);
      expect(labServiceStub.setLayoutMode).toHaveBeenCalled();
    });
  });
});
