import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudRepartidorPage } from './solicitud-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudRepartidorPageRoutingModule {}
