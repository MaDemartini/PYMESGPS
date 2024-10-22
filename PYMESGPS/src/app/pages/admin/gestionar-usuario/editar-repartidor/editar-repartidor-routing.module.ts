import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarRepartidorPage } from './editar-repartidor.page';

const routes: Routes = [
  {
    path: '',
    component: EditarRepartidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarRepartidorPageRoutingModule {}
