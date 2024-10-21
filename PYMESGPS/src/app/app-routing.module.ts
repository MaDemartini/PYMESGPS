import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isadminGuard } from './guards/isadmin/isadmin.guard';
import { isEmprendedorGuard } from './guards/isemprendedor/isemprendedor.guard';
import { isRepartidorGuard } from './guards/isrepartidor/isrepartidor.guard';
import { isClienteGuard } from './guards/iscliente/iscliente.guard';
import { authGuard } from './guards/isauth/isauth.guard';


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
    loadChildren: () => import('./pages/home/home-emp/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard]  // Protege el home de emprendedores y repartidores
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home/home-admin/home-admin.module').then(m => m.HomeAdminPageModule),
    canActivate: [authGuard, isadminGuard]  // Proteger esta ruta con el guard de admin
  },
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule),
    canActivate: [authGuard, isClienteGuard]  // Protege el home del cliente
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [authGuard] // Solo usuarios autenticados pueden ver el perfil
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/emprendedor/productos/productos.module').then( m => m.ProductosPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la gestión de productos para emprendedores
  },
  {
    path: 'lotes',
    loadChildren: () => import('./pages/emprendedor/lotes/lotes.module').then( m => m.LotesPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la gestión de lotes para emprendedores
  },
  {
    path: 'gestionar-repartidor',
    loadChildren: () => import('./pages/emprendedor/gestionar-repartidor/gestionar-repartidor.module').then( m => m.GestionarRepartidorPageModule)
  },
  {
    path: 'solicitudes-repartidor',
    loadChildren: () => import('./pages/emprendedor/solicitudes-repartidor/solicitudes-repartidor.module').then( m => m.SolicitudesRepartidorPageModule)
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pages/emprendedor/pedidos/pedidos.module').then( m => m.PedidosPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la vista de pedidos para emprendedores
  },
  {
    path: 'reportes',
    loadChildren: () => import('./pages/admin/reportes/reportes.module').then( m => m.ReportesPageModule),
    canActivate: [authGuard, isadminGuard]  // Proteger la visualización de reportes para admins
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },  {
    path: 'solicitudes-emprendedores-reparto',
    loadChildren: () => import('./pages/admin/solicitudes-emprendedores-reparto/solicitudes-emprendedores-reparto.module').then( m => m.SolicitudesEmprendedoresRepartoPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
