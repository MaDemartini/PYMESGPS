import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleLotePage } from './detalle-lote.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleLotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleLotePageRoutingModule {}
