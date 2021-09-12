import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BackgroundService } from '../../../core/services/background.service';

import { CategoryService } from '../../../core/services/category.service';
import { SharedModule } from '../../../shared/shared.module';
import { BackgroundManagementComponent } from './background-management.component';

describe('BackgroundManagementComponent', () => {
  let component: BackgroundManagementComponent;
  let fixture: ComponentFixture<BackgroundManagementComponent>;

  beforeEach(async () => {
    const backgroundServiceStub = () => ({
      getBackgrounds: () => of([]),
      patchBackground: () => of(null),
      deleteBackground: () => of(null),
    });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [BackgroundManagementComponent],
      providers: [{ provide: BackgroundService, useFactory: backgroundServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
