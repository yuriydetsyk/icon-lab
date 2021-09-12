import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockComponents, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { BackgroundService } from '../../../core/services/background.service';
import { IconService } from '../../../core/services/icon.service';
import { ButtonGroupComponent } from '../../../shared/components/button-group/button-group.component';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { FormatBytesPipe } from '../../../shared/pipes/format-bytes.pipe';
import { BgBulkUploadComponent } from './bg-bulk-upload.component';

describe('BgBulkUploadComponent', () => {
  let component: BgBulkUploadComponent;
  let fixture: ComponentFixture<BgBulkUploadComponent>;

  beforeEach(async () => {
    const backgroundServiceStub = { uploadBackgrounds: () => of(null) };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        BgBulkUploadComponent,
        ...MockComponents(ButtonGroupComponent, NotificationsComponent),
        MockPipe(FormatBytesPipe),
      ],
      providers: [{ provide: BackgroundService, useValue: backgroundServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
