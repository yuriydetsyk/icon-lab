import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BackgroundService } from '../../../core/services/background.service';
import { IconService } from '../../../core/services/icon.service';
import { ImageService } from '../../../core/services/image.service';
import { LabService } from '../../../core/services/lab.service';
import { IconPosition } from '../../../models/enums/icon-position';
import { IconType } from '../../../models/enums/icon-type';
import { PlaygroundIconComponent } from './playground-icon.component';

describe('PlaygroundIconComponent', () => {
  let component: PlaygroundIconComponent;
  let fixture: ComponentFixture<PlaygroundIconComponent>;

  beforeEach(() => {
    const renderer2Stub = () => ({
      createElement: (str: any, SVG_NAMESPACE: any) => ({}),
      setAttribute: (imageEl: any, str: any, url: any) => ({}),
      appendChild: (svgBody: any, imageEl: any) => ({}),
      addClass: (svgBody: any, str: any) => ({}),
    });
    const imageServiceStub = () => ({ getSvgBody: (id: number) => ({}) });
    const iconServiceStub = () => ({ parseSvg: (url: any) => ({}) });
    const labServiceStub = () => ({
      colorChanged: of({}),
      setPosition: (position: any) => ({}),
      rotationAnglesChanged: of({}),
      layoutModeChanged: of({}),
      positionChanged: of(IconPosition.Center),
      getIconCoordinates: () => ({ x: 0, y: 0 }),
      getIconSize: () => ({ width: 0, height: 0 }),
    });
    const backgroundServiceStub = () => ({
      background: {},
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PlaygroundIconComponent],
      providers: [
        { provide: Renderer2, useFactory: renderer2Stub },
        { provide: ImageService, useFactory: imageServiceStub },
        { provide: IconService, useFactory: iconServiceStub },
        { provide: LabService, useFactory: labServiceStub },
        { provide: BackgroundService, useFactory: backgroundServiceStub },
      ],
    });
    fixture = TestBed.createComponent(PlaygroundIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`position has default value`, () => {
    expect(component.position).toEqual(IconPosition.Center);
  });

  it(`hover has default value`, () => {
    expect(component.hover).toEqual(false);
  });

  it(`IconType has default value`, () => {
    expect(component.IconType).toEqual(IconType);
  });
});
