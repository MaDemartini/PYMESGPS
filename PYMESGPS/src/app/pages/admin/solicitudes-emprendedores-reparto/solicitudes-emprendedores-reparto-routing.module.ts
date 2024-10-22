import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesEmprendedoresRepartoPage } from './solicitudes-emprendedores-reparto.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesEmprendedoresRepartoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesEmprendedoresRepartoPageRoutingModule {}
