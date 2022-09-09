import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CategoryService } from '../../../../core/services/category.service';

import { IconService } from '../../../../core/services/icon.service';
import { LabService } from '../../../../core/services/lab.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { IconDto } from '../../../../models/dto/icon-dto';
import { TabIconsComponent } from './tab-icons.component';

describe('TabIconsComponent', () => {
  let component: TabIconsComponent;
  let fixture: ComponentFixture<TabIconsComponent>;

  beforeEach(() => {
    const iconServiceStub = () => ({
      getIcons: () => of([]),
      getIconFilters: () => ({}),
      getCategories: () => of([]),
    });
    const labServiceStub = () => ({ setIcon: (icon: any) => ({}) });
    const loadingServiceStub = () => ({
      loadingSub: of(false),
      loadingMap: { has: () => false },
    });
    const categoryServiceStub = () => ({ getCategories: () => of([]) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [TabIconsComponent],
      providers: [
        { provide: IconService, useFactory: iconServiceStub },
        { provide: LabService, useFactory: labServiceStub },
        { provide: LoadingService, useFactory: loadingServiceStub },
        { provide: CategoryService, useFactory: categoryServiceStub },
      ],
    });
    fixture = TestBed.createComponent(TabIconsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe('setIcon', () => {
    it('makes expected calls', () => {
      const labServiceStub = TestBed.inject(LabService);
      const iconDtoStub = {} as IconDto;
      jest.spyOn(labServiceStub, 'setIcon');
      component.setIcon(iconDtoStub);
      expect(labServiceStub.setIcon).toHaveBeenCalled();
    });
  });
});
