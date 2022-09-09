import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LabService } from '../../../../../core/services/lab.service';
import { IconDto } from '../../../../../models/dto/icon-dto';
import { RecentlyUsedComponent } from './recently-used.component';

describe('RecentlyUsedComponent', () => {
  let component: RecentlyUsedComponent;
  let fixture: ComponentFixture<RecentlyUsedComponent>;

  beforeEach(() => {
    const labServiceStub = () => ({ setIcon: (icon: any) => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RecentlyUsedComponent],
      providers: [{ provide: LabService, useFactory: labServiceStub }],
    });
    fixture = TestBed.createComponent(RecentlyUsedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
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
