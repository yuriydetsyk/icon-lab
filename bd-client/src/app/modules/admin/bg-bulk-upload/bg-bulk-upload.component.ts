import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BackgroundService } from '../../../core/services/background.service';

import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'bd-bg-bulk-upload',
  templateUrl: './bg-bulk-upload.component.html',
  styleUrls: ['./bg-bulk-upload.component.scss'],
})
export class BgBulkUploadComponent implements OnDestroy {
  @ViewChild('files') public filesEl: ElementRef<HTMLInputElement>;
  public selectedFiles: FileList;
  public filePreviews = new Map<string, Promise<string>>();
  public get selectedFilesArray(): File[] {
    return Array.from(this.selectedFiles || []);
  }
  public loading = false;
  public notifications$ = this.notificationService.notificationsChanged;
  private destroyed$ = new Subject<void>();

  constructor(
    private readonly backgroundService: BackgroundService,
    private readonly domSanitizer: DomSanitizer,
    private readonly notificationService: NotificationService
  ) {}

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public selectFiles(event: any) {
    this.selectedFiles = event.target.files || [];

    this.selectedFilesArray.forEach((file) => {
      this.filePreviews.set(
        file.name,
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(this.domSanitizer.bypassSecurityTrustUrl(reader.result as string) as string);
          };
          reader.onerror = (e) => {
            reject(e);
          };

          reader.readAsDataURL(file);
        })
      );
    });
  }

  public uploadBackgrounds() {
    if (!this.selectedFiles) {
      return;
    }

    const formData = new FormData();
    for (const file of this.selectedFilesArray) {
      formData.append('files', file);
    }

    this.backgroundService
      .uploadBackgrounds(formData)
      .pipe(
        tap(() => (this.loading = true)),
        catchError((e) => throwError(e)),
        finalize(() => {
          this.addUploadNotification(this.selectedFilesArray.length);
          this.loading = false;
          this.filesEl.nativeElement.value = null;
        })
      )
      .subscribe();
  }

  public trackFn(_: number, item: File) {
    return item.name;
  }

  private addUploadNotification(qty: number) {
    this.notificationService.addNotification({
      title: 'Backgrounds Bulk Upload',
      createdAt: new Date(),
      body: `${qty} backgrounds have been uploaded.`,
    });
  }
}
