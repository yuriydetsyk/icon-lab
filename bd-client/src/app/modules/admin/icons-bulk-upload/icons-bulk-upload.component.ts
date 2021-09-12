import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { IconService } from '../../../core/services/icon.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'bd-icons-bulk-upload',
  templateUrl: './icons-bulk-upload.component.html',
  styleUrls: ['./icons-bulk-upload.component.scss'],
})
export class IconsBulkUploadComponent implements OnDestroy {
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
    private readonly iconService: IconService,
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

  public uploadIcons() {
    if (!this.selectedFiles) {
      return;
    }

    const formData = new FormData();
    for (const file of this.selectedFilesArray) {
      formData.append('files', file);
    }

    this.iconService
      .uploadIcons(formData)
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

  private addUploadNotification(iconsQty: number) {
    this.notificationService.addNotification({
      title: 'Icons Bulk Upload',
      createdAt: new Date(),
      body: `${iconsQty} icons have been uploaded.`,
    });
  }
}
