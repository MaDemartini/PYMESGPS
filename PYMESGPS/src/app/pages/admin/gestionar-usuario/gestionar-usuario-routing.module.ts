import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarUsuarioPage } from './gestionar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarUsuarioPage
  },  {
    path: 'agregar-cliente',
    loadChildren: () => import('./agregar-cliente/agregar-cliente.module').then( m => m.AgregarClientePageModule)
  },
  {
    path: 'editar-cliente',
    loadChildren: () => import('./editar-cliente/editar-cliente.module').then( m => m.EditarClientePageModule)
  },
  {
    path: 'editar-emprendedor',
    loadChildren: () => import('./editar-emprendedor/editar-emprendedor.module').then( m => m.EditarEmprendedorPageModule)
  },
  {
    path: 'agregar-emprendedor',
    loadChildren: () => import('./agregar-emprendedor/agregar-emprendedor.module').then( m => m.AgregarEmprendedorPageModule)
  },
  {
    path: 'editar-repartidor',
    loadChildren: () => import('./editar-repartidor/editar-repartidor.module').then( m => m.EditarRepartidorPageModule)
  },
  {
    path: 'agregar-repartidor',
    loadChildren: () => import('./agregar-repartidor/agregar-repartidor.module').then( m => m.AgregarRepartidorPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarUsuarioPageRoutingModule {}
