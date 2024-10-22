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
    path: 'perfil',
    loadChildren: () => import('./pages/home/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [authGuard] // Solo usuarios autenticados pueden ver el perfil
  },
  {
    path: 'contexto',
    loadChildren: () => import('./pages/home/contexto/contexto.module').then( m => m.ContextoPageModule)
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
    path: 'home-admin',
    loadChildren: () => import('./pages/home/home-admin/home-admin.module').then(m => m.HomeAdminPageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'reportes',
    loadChildren: () => import('./pages/admin/reportes/reportes.module').then( m => m.ReportesPageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'gestionar-usuario',
    loadChildren: () => import('./pages/admin/gestionar-usuario/gestionar-usuario.module').then( m => m.GestionarUsuarioPageModule),
    canActivate: [authGuard, isadminGuard] 
  },
  {
    path: 'agregar-cliente',
    loadChildren: () => import('./pages/admin/gestionar-usuario/agregar-cliente/agregar-cliente.module').then(m => m.AgregarClientePageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'agregar-emprendedor',
    loadChildren: () => import('./pages/admin/gestionar-usuario/agregar-emprendedor/agregar-emprendedor.module').then(m => m.AgregarEmprendedorPageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'agregar-repartidor',
    loadChildren: () => import('./pages/admin/gestionar-usuario/agregar-repartidor/agregar-repartidor.module').then(m => m.AgregarRepartidorPageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'editar-cliente/:id',
    loadChildren: () => import('./pages/admin/gestionar-usuario/editar-cliente/editar-cliente.module').then(m => m.EditarClientePageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'editar-emprendedor/:id',
    loadChildren: () => import('./pages/admin/gestionar-usuario/editar-emprendedor/editar-emprendedor.module').then(m => m.EditarEmprendedorPageModule),
    canActivate: [authGuard, isadminGuard]  
  },
  {
    path: 'editar-repartidor/:id',
    loadChildren: () => import('./pages/admin/gestionar-usuario/editar-repartidor/editar-repartidor.module').then(m => m.EditarRepartidorPageModule),
    canActivate: [authGuard, isadminGuard]  
  },  
  {
    path: 'solicitudes-emprendedores-reparto',
    loadChildren: () => import('./pages/admin/solicitudes-emprendedores-reparto/solicitudes-emprendedores-reparto.module').then( m => m.SolicitudesEmprendedoresRepartoPageModule),
    canActivate:  [authGuard, isadminGuard] 
  },
  {
    path: 'solicitud-servicio',
    loadChildren: () => import('./pages/emprendedor/solicitud-servicio/solicitud-servicio.module').then( m => m.SolicitudServicioPageModule)
  },

  // CLIENTE
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule),
    canActivate: [authGuard, isClienteGuard]  // Protege el home del cliente
  },
  {
    path: 'seguimiento',
    loadChildren: () => import('./pages/cliente/seguimiento/seguimiento.module').then( m => m.SeguimientoPageModule),
    canActivate: [authGuard, isClienteGuard]  // Protege el home del cliente
  },
  


  // EMPRENDEDOR
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home-emp/home.module').then( m => m.HomePageModule),
    canActivate: [authGuard]  // Protege el home de emprendedores y repartidores
  },

  {
    path: 'productos',
    loadChildren: () => import('./pages/emprendedor/productos/productos.module').then( m => m.ProductosPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la gestión de productos para emprendedores
  },
  {
    path: 'actualizar-productos',
    loadChildren: () => import('./pages/emprendedor/productos/actualizar-productos/actualizar-productos.module').then( m => m.ActualizarProductosPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la gestión de productos para emprendedores
  },
  {
    path: 'agregar-productos',
    loadChildren: () => import('./pages/emprendedor/productos/agregar-productos/agregar-productos.module').then( m => m.AgregarProductosPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la gestión de productos para emprendedores
  },


  {
    path: 'gestionar-lote',
    loadChildren: () => import('./pages/emprendedor/gestionar-lote/gestionar-lote.module').then( m => m.GestionarLotePageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la gestión de lotes para emprendedores
  },
  {
    path: 'gestionar-repartidor',
    loadChildren: () => import('./pages/emprendedor/gestionar-repartidor/gestionar-repartidor.module').then( m => m.GestionarRepartidorPageModule),
    canActivate: [authGuard, isEmprendedorGuard]
  },
  {
    path: 'solicitudes-repartidor',
    loadChildren: () => import('./pages/emprendedor/gestionar-repartidor/solicitudes-repartidor/solicitudes-repartidor.module').then( m => m.SolicitudesRepartidorPageModule),
    canActivate: [authGuard, isEmprendedorGuard]
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pages/emprendedor/pedidos/pedidos.module').then( m => m.PedidosPageModule),
    canActivate: [authGuard, isEmprendedorGuard]  // Protege la vista de pedidos para emprendedores
  },

  // REPARTIDOR
  {
    path: 'rutas',
    loadChildren: () => import('./pages/repartidor/rutas/rutas.module').then( m => m.RutasPageModule),
    canActivate: [authGuard, isRepartidorGuard]  // Protege la vista de pedidos para emprendedores
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
