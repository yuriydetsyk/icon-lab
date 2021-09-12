import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BackgroundService } from '../../core/services/background.service';
import { LabService } from '../../core/services/lab.service';
import { LayoutService } from '../../core/services/layout.service';
import { IconPosition } from '../../models/enums/icon-position';
import { LabComponent } from './lab.component';

describe('LabComponent', () => {
  let component: LabComponent;
  let fixture: ComponentFixture<LabComponent>;

  beforeEach(() => {
    const labServiceStub = {
      setColor: (color: any) => ({}),
      filledElementsChanged: of([]),
      iconsChanged: of({ get: () => {} }),
      positionChanged: of(IconPosition.Center),
      savedColorsChanged: of([]),
      backgroundColorChanged: of(''),
      clearColors: () => {},
      iconChanged: of(),
    };
    const layoutServiceStub = {
      MEDIA_QUERIES: {},
      openedRightSidebar: of(false),
    };
    const backgroundServiceStub = {
      backgroundColorChanged: of(''),
      setBackgroundColor: () => {},
    };
    const breakpointObserverStub = { observe: () => of({}) };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LabComponent],
      providers: [
        { provide: LabService, useValue: labServiceStub },
        { provide: BackgroundService, useValue: backgroundServiceStub },
        { provide: LayoutService, useValue: layoutServiceStub },
        { provide: BreakpointObserver, useValue: breakpointObserverStub },
      ],
    });
    fixture = TestBed.createComponent(LabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
