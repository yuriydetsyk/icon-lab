import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CollectionComponent } from './components/collection/collection.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [AppComponent, CollectionComponent, FeedbackComponent, LeftSidebarComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule, CoreModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
