import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { IconStyleService } from '../../../../core/services/icon-style.service';
import { IconStyleComponent } from './icon-style/icon-style.component';
import { TabStylesComponent } from './tab-styles.component';

describe('TabStylesComponent', () => {
  let component: TabStylesComponent;
  let fixture: ComponentFixture<TabStylesComponent>;
  const iconStyleServiceStub = {
    setStyle: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabStylesComponent, MockComponent(IconStyleComponent)],
      providers: [{ provide: IconStyleService, useValue: iconStyleServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
