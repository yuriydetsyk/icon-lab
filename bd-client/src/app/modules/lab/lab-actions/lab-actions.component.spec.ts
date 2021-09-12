import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabService } from '../../../core/services/lab.service';
import { LabActionsComponent } from './lab-actions.component';

describe('LabActionsComponent', () => {
  let component: LabActionsComponent;
  let fixture: ComponentFixture<LabActionsComponent>;
  const renderer2Stub = () => ({
    listen: (str: any, string1: any, function0: any) => ({}),
  });
  const labServiceStub = () => ({ exportSvg: (mode: any) => ({}) });

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LabActionsComponent],
      providers: [
        { provide: Renderer2, useFactory: renderer2Stub },
        { provide: LabService, useFactory: labServiceStub },
      ],
    });
    fixture = TestBed.createComponent(LabActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
