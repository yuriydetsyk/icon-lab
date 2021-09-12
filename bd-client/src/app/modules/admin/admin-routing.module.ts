import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../../core/guards/admin.guard';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminComponent } from './admin.component';
import { BackgroundManagementComponent } from './background-management/background-management.component';
import { BgBulkUploadComponent } from './bg-bulk-upload/bg-bulk-upload.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { IconManagementComponent } from './icon-management/icon-management.component';
import { IconsBulkUploadComponent } from './icons-bulk-upload/icons-bulk-upload.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminHomeComponent },
      {
        path: 'icons',
        children: [
          { path: 'upload', component: IconsBulkUploadComponent },
          { path: '', component: IconManagementComponent },
        ],
      },
      { path: 'categories', component: CategoryManagementComponent },
      {
        path: 'backgrounds',
        children: [
          { path: 'upload', component: BgBulkUploadComponent },
          { path: '', component: BackgroundManagementComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
