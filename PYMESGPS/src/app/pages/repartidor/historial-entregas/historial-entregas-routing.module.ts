import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialEntregasPage } from './historial-entregas.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialEntregasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialEntregasPageRoutingModule {}
