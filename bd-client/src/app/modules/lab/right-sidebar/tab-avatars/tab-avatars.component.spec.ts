import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TabAvatarsComponent } from './tab-avatars.component';

describe('TabAvatarsComponent', () => {
  let component: TabAvatarsComponent;
  let fixture: ComponentFixture<TabAvatarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TabAvatarsComponent],
    });
    fixture = TestBed.createComponent(TabAvatarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
