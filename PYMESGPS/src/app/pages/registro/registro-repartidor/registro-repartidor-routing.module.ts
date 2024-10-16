import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroRepartidorPage } from './registro-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroRepartidorPageRoutingModule {}
