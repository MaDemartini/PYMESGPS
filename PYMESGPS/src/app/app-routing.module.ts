import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
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
    loadChildren: () => import('./pages/registro-cliente/registro-cliente.module').then( m => m.RegistroClientePageModule)
  },
  {
    path: 'registro-emprendedor',
    loadChildren: () => import('./pages/registro-emprendedor/registro-emprendedor.module').then( m => m.RegistroEmprendedorPageModule)
  },
  {
    path: 'registro-admin',
    loadChildren: () => import('./pages/registro-admin/registro-admin.module').then( m => m.RegistroAdminPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
