import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'home-admin',
    loadChildren: () => import('../home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('../home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
