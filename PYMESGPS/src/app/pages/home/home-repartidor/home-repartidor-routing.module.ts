import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeRepartidorPage } from './home-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: HomeRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRepartidorPageRoutingModule {}
