import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeEmprendedorPage } from './home-emprendedor.page';

const routes: Routes = [
  {
    path: '',
    component: HomeEmprendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeEmprendedorPageRoutingModule {}
