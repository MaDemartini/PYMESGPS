import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarEmprendedorPage } from './editar-emprendedor.page';

const routes: Routes = [
  {
    path: '',
    component: EditarEmprendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarEmprendedorPageRoutingModule {}
