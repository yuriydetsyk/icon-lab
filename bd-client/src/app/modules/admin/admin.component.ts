import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { TabId } from '../../models/enums/tab-id';
import { NavTab } from '../../models/interfaces/nav-tab';

@Component({
  selector: 'bd-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  public adminTabs: NavTab[] = [
    {
      id: TabId.IconManagement,
      title: 'Icon Management',
      url: '/admin/icons',
    },
    {
      id: TabId.IconsBulkUpload,
      title: 'Icons Bulk Upload',
      url: '/admin/icons/upload',
    },
    {
      id: TabId.CategoryManagement,
      title: 'Category Management',
      url: '/admin/categories',
    },
    {
      id: TabId.BackgroundManagement,
      title: 'Background Management',
      url: '/admin/backgrounds',
    },
    {
      id: TabId.BgBulkUpload,
      title: 'Backgrounds Bulk Upload',
      url: '/admin/backgrounds/upload',
    },
  ];
  // public activeTabId: TabId;
  public TabId = TabId;
  public get username() {
    return this.authService.username || 'ADMIN';
  }

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  public onTabChange(tabId: TabId) {
    const tab = this.adminTabs.find((t) => t.id === tabId);
    this.router.navigate([tab.url]);
  }

  public toWebsite() {
    this.router.navigate(['']);
  }

  public logout() {
    this.authService.logout().subscribe();
  }
}
