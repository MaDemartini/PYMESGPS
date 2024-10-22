import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarEmprendedorPage } from './agregar-emprendedor.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarEmprendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarEmprendedorPageRoutingModule {}
