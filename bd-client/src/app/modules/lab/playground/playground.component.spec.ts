import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BackgroundService } from '../../../core/services/background.service';
import { LabService } from '../../../core/services/lab.service';
import { IconPosition } from '../../../models/enums/icon-position';
import { PlaygroundComponent } from './playground.component';

describe('PlaygroundComponent', () => {
  let component: PlaygroundComponent;
  let fixture: ComponentFixture<PlaygroundComponent>;

  beforeEach(() => {
    const backgroundServiceStub = {
      backgroundColorChanged: of(''),
      backgroundChanged: of({}),
    };
    const labServiceStub = {
      iconsChanged: { pipe: () => ({}) },
      availablePositionsChanged: of([]),
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PlaygroundComponent],
      providers: [
        { provide: BackgroundService, useValue: backgroundServiceStub },
        { provide: LabService, useValue: labServiceStub },
      ],
    });
    fixture = TestBed.createComponent(PlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`IconPosition has default value`, () => {
    expect(component.IconPosition).toEqual(IconPosition);
  });

  it(`availablePositions$ has default value`, () => {
    expect(component.availablePositions$).toEqual(TestBed.inject(LabService).availablePositionsChanged);
  });
});
