import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockComponents, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { IconService } from '../../../core/services/icon.service';
import { ButtonGroupComponent } from '../../../shared/components/button-group/button-group.component';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { FormatBytesPipe } from '../../../shared/pipes/format-bytes.pipe';

import { IconsBulkUploadComponent } from './icons-bulk-upload.component';

describe('IconsBulkUploadComponent', () => {
  let component: IconsBulkUploadComponent;
  let fixture: ComponentFixture<IconsBulkUploadComponent>;

  beforeEach(async () => {
    const iconServiceStub = () => ({ uploadIcons: () => of(null) });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        IconsBulkUploadComponent,
        ...MockComponents(ButtonGroupComponent, NotificationsComponent),
        MockPipe(FormatBytesPipe),
      ],
      providers: [{ provide: IconService, useFactory: iconServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
