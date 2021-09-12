import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CategoryService } from '../../../core/services/category.service';
import { IconService } from '../../../core/services/icon.service';
import { SharedModule } from '../../../shared/shared.module';
import { IconManagementComponent } from './icon-management.component';

describe('IconManagementComponent', () => {
  let component: IconManagementComponent;
  let fixture: ComponentFixture<IconManagementComponent>;

  beforeEach(async () => {
    const iconServiceStub = () => ({
      getIcons: () => of([]),
      deleteIconCategory: () => of(null),
      addIconCategory: () => of(null),
      deleteIcon: () => of(null),
      patchIcon: () => of(null),
    });
    const categoryServiceStub = () => ({ getCategories: () => of([]) });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [IconManagementComponent],
      providers: [
        { provide: IconService, useFactory: iconServiceStub },
        { provide: CategoryService, useFactory: categoryServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
