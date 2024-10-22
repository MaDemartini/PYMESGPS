import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarRepartidorPage } from './agregar-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarRepartidorPageRoutingModule {}
