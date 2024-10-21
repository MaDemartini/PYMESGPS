import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarProductosPage } from './eliminar-productos.page';

const routes: Routes = [
  {
    path: '',
    component: EliminarProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EliminarProductosPageRoutingModule {}
