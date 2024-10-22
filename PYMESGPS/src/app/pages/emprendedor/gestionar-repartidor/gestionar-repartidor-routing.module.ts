import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarRepartidorPage } from './gestionar-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarRepartidorPageRoutingModule {}
