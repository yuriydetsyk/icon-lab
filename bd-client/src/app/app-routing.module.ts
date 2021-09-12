import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppPreloadingStrategy } from './app-preloading-strategy';
import { CollectionComponent } from './components/collection/collection.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LeftSidebarComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lab',
      },
      {
        path: 'lab',
        loadChildren: () => import('./modules/lab/lab.module').then((m) => m.LabModule),
        data: { preload: true },
      },
      {
        path: 'collection',
        component: CollectionComponent,
      },
      {
        path: 'feedback',
        component: FeedbackComponent,
      },
    ],
  },
  {
    path: 'styleguide',
    loadChildren: () => import('./modules/styleguide/styleguide.module').then((m) => m.StyleguideModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: 'login', component: LoginComponent },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'lab',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AppPreloadingStrategy,
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
