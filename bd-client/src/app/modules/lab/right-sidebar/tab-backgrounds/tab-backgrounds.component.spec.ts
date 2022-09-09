import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { BackgroundService } from '../../../../core/services/background.service';
import { CategoryService } from '../../../../core/services/category.service';
import { IconService } from '../../../../core/services/icon.service';
import { LabService } from '../../../../core/services/lab.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { BackgroundDto } from '../../../../models/dto/background-dto';
import { TabBackgroundsComponent } from './tab-backgrounds.component';

describe('TabIconsComponent', () => {
  let component: TabBackgroundsComponent;
  let fixture: ComponentFixture<TabBackgroundsComponent>;

  beforeEach(() => {
    const iconServiceStub = () => ({
      getIcons: () => of([]),
      getIconFilters: () => ({}),
      getCategories: () => of([]),
    });
    const loadingServiceStub = () => ({
      loadingSub: of(false),
      loadingMap: { has: () => false },
    });
    const backgroundServiceStub = () => ({
      getBackgrounds: () => of([]),
      setBackground: () => { },
    });
    const categoryServiceStub = () => ({ getCategories: () => of([]) });
    const labServiceStub = () => ({ clearPositionSetting: () => { } });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [TabBackgroundsComponent],
      providers: [
        { provide: IconService, useFactory: iconServiceStub },
        { provide: LoadingService, useFactory: loadingServiceStub },
        { provide: BackgroundService, useFactory: backgroundServiceStub },
        { provide: CategoryService, useFactory: categoryServiceStub },
        { provide: LabService, useFactory: labServiceStub },
      ],
    });
    fixture = TestBed.createComponent(TabBackgroundsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe('setBackground', () => {
    it('makes expected calls', () => {
      const backgroundService = TestBed.inject(BackgroundService);
      const bgDtoStub = {} as BackgroundDto;
      jest.spyOn(backgroundService, 'setBackground');
      component.setBackground(bgDtoStub);
      expect(backgroundService.setBackground).toHaveBeenCalled();
    });
  });
});
