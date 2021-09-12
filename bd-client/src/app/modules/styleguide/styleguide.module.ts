import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { StyleguideRoutingModule } from './styleguide-routing.module';
import { StyleguideComponent } from './styleguide.component';

@NgModule({
  declarations: [StyleguideComponent],
  imports: [CommonModule, SharedModule, StyleguideRoutingModule],
})
export class StyleguideModule {}
