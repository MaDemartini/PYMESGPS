import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesRepartidorPage } from './solicitudes-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesRepartidorPageRoutingModule {}
