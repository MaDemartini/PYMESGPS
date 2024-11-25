import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LotesCreadosPage } from './lotes-creados.page';

const routes: Routes = [
  {
    path: '',
    component: LotesCreadosPage
  },  {
    path: 'detalle-lote',
    loadChildren: () => import('./detalle-lote/detalle-lote.module').then( m => m.DetalleLotePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LotesCreadosPageRoutingModule {}
