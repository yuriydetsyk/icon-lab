import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';

import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { PlaygroundIconComponent } from './components/playground-icon/playground-icon.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { IconComponent } from './components/icon/icon.component';
import { FormatBytesPipe } from './pipes/format-bytes.pipe';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { KebabCasePipe } from './pipes/kebab-case.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ModalComponent } from './components/modal/modal.component';

const ANGULAR_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];
const OTHER_MODULES = [ColorPickerModule];
const COMPONENTS = [
  ColorPickerComponent,
  PlaygroundIconComponent,
  SearchInputComponent,
  TextInputComponent,
  TabsComponent,
  IconComponent,
  ButtonGroupComponent,
  FooterComponent,
  DropdownComponent,
  NotificationsComponent,
  ModalComponent,
];
const PIPES = [FormatBytesPipe, KebabCasePipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [...ANGULAR_MODULES, ...OTHER_MODULES],
  exports: [...ANGULAR_MODULES, ...OTHER_MODULES, ...COMPONENTS, ...PIPES],
})
export class SharedModule {}
