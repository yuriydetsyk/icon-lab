import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../../shared/shared.module';
import { IconsBulkUploadComponent } from './icons-bulk-upload/icons-bulk-upload.component';
import { IconManagementComponent } from './icon-management/icon-management.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { BackgroundManagementComponent } from './background-management/background-management.component';
import { BgBulkUploadComponent } from './bg-bulk-upload/bg-bulk-upload.component';

@NgModule({
  declarations: [
    AdminComponent,
    IconsBulkUploadComponent,
    BgBulkUploadComponent,
    IconManagementComponent,
    AdminHomeComponent,
    CategoryManagementComponent,
    BackgroundManagementComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule],
})
export class AdminModule {}
