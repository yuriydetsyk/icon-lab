import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CategoryService } from '../../../core/services/category.service';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryManagementComponent } from './category-management.component';

describe('CategoryManagementComponent', () => {
  let component: CategoryManagementComponent;
  let fixture: ComponentFixture<CategoryManagementComponent>;

  beforeEach(async () => {
    const categoryServiceStub = () => ({
      getCategories: () => of([]),
      addCategory: () => of(null),
      patchCategory: () => of(null),
      deleteCategory: () => of(null),
    });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [CategoryManagementComponent],
      providers: [{ provide: CategoryService, useFactory: categoryServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
