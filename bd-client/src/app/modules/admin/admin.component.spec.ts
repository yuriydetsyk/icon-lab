import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponents } from 'ng-mocks';
import { AuthService } from '../../core/services/auth.service';

import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { AdminComponent } from './admin.component';
import { IconsBulkUploadComponent } from './icons-bulk-upload/icons-bulk-upload.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    const authServiceStub = () => ({
      getParsedToken: () => ({}),
      logout: () => {},
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdminComponent, MockComponents(TabsComponent, IconsBulkUploadComponent)],
      providers: [{ provide: AuthService, useFactory: authServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
