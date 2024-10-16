import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isadminGuard } from './guard/isadmin/isadmin.guard';

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
    path: 'registro-repartidor',
    loadChildren: () => import('./pages/registro/registro-repartidor/registro-repartidor.module').then( m => m.RegistroRepartidorPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home-emp/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home/home-admin/home-admin.module').then(m => m.HomeAdminPageModule),
    canActivate: [isadminGuard]  // Proteger esta ruta con el guard de admin
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'solicitud-repartidor',
    loadChildren: () => import('./pages/registro/solicitud/solicitud-repartidor/solicitud-repartidor.module').then( m => m.SolicitudRepartidorPageModule)
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
