import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconStyleService } from '../../../../../core/services/icon-style.service';
import { IconStyleComponent } from './icon-style.component';

describe('IconStyleComponent', () => {
  let component: IconStyleComponent;
  let fixture: ComponentFixture<IconStyleComponent>;
  const iconStyleServiceStub = {
    isActive: () => true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconStyleComponent],
      providers: [{ provide: IconStyleService, useValue: iconStyleServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
