import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        children: [{ path: '', loadChildren: '../dashboard/dashboard.module#DashboardPageModule' }],
      },
      {
        path: 'profile',
        children: [{ path: '', loadChildren: '../profile/profile.module#ProfilePageModule' }],
      },
    ],
  },
  { path: '', redirectTo: '/tabs/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
