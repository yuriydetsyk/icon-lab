import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabRoutingModule } from './lab-routing.module';
import { LabComponent } from './lab.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { PlaygroundComponent } from './playground/playground.component';
import { SharedModule } from '../../shared/shared.module';
import { TabIconsComponent } from './right-sidebar/tab-icons/tab-icons.component';
import { TabAvatarsComponent } from './right-sidebar/tab-avatars/tab-avatars.component';
import { LayoutSelectorComponent } from './layout-selector/layout-selector.component';
import { RecentlyUsedComponent } from './right-sidebar/tab-icons/recently-used/recently-used.component';
import { LabActionsComponent } from './lab-actions/lab-actions.component';
import { TabBackgroundsComponent } from './right-sidebar/tab-backgrounds/tab-backgrounds.component';
import { TabStylesComponent } from './right-sidebar/tab-styles/tab-styles.component';
import { IconStyleComponent } from './right-sidebar/tab-styles/icon-style/icon-style.component';

@NgModule({
  declarations: [
    LabComponent,
    RightSidebarComponent,
    PlaygroundComponent,
    TabIconsComponent,
    TabBackgroundsComponent,
    TabAvatarsComponent,
    LayoutSelectorComponent,
    RecentlyUsedComponent,
    LabActionsComponent,
    TabStylesComponent,
    IconStyleComponent,
  ],
  imports: [CommonModule, LabRoutingModule, SharedModule],
})
export class LabModule {}
