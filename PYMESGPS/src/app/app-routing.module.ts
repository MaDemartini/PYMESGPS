import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'contexto',
    loadChildren: () => import('./pages/contexto/contexto.module').then( m => m.ContextoPageModule)
  },
  {
    path: 'registro-cliente',
    loadChildren: () => import('./pages/registro/registro-cliente/registro-cliente.module').then( m => m.RegistroClientePageModule)
  },
  {
    path: 'registro-emprendedor',
    loadChildren: () => import('./pages/registro/registro-emprendedor/registro-emprendedor.module').then( m => m.RegistroEmprendedorPageModule)
  },
  {
    path: 'registro-admin',
    loadChildren: () => import('./pages/registro/registro-admin/registro-admin.module').then( m => m.RegistroAdminPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  },
  {
    path: 'home-emprendedor',
    loadChildren: () => import('./pages/home/home-emprendedor/home-emprendedor.module').then( m => m.HomeEmprendedorPageModule)
  },
  {
    path: 'home-repartidor',
    loadChildren: () => import('./pages/home/home-repartidor/home-repartidor.module').then( m => m.HomeRepartidorPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
