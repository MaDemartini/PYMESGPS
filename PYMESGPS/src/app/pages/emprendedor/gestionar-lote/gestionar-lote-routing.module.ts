import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarLotePage } from './gestionar-lote.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarLotePage
  },  {
    path: 'lotes-creados',
    loadChildren: () => import('./lotes-creados/lotes-creados.module').then( m => m.LotesCreadosPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarLotePageRoutingModule {}
