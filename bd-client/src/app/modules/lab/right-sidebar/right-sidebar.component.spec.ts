import { BreakpointObserver } from '@angular/cdk/layout';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LabService } from '../../../core/services/lab.service';
import { LayoutService } from '../../../core/services/layout.service';
import { TabId } from '../../../models/enums/tab-id';
import { RightSidebarComponent } from './right-sidebar.component';

describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  const renderer2Stub = () => ({
    listen: (str: any, string1: any, function0: any) => ({}),
  });
  const labServiceStub = () => ({
    hasIconPosition$: of(true),
    hasBackgroundPosition$: of(false),
  });
  const layoutServiceStub = () => ({
    MEDIA_QUERIES: {},
    toggleRightSidebar: () => {},
  });
  const breakpointObserverStub = {
    observe: () => of({}),
    isMatched: () => true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RightSidebarComponent],
      providers: [
        { provide: Renderer2, useFactory: renderer2Stub },
        { provide: LabService, useFactory: labServiceStub },
        { provide: LayoutService, useFactory: layoutServiceStub },
        { provide: BreakpointObserver, useValue: breakpointObserverStub },
      ],
    });
    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`labTabs has default value`, () => {
    expect(component.labTabs.length).toBe(2);
  });

  it(`TabId has default value`, () => {
    expect(component.TabId).toBe(TabId);
  });
});
