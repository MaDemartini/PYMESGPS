import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroEmprendedorPage } from './registro-emprendedor.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroEmprendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroEmprendedorPageRoutingModule {}
