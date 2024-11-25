import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { Notificacion } from 'src/app/models/notificacion';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  repartidor: boolean = false;  // Para verificar si es repartidor
  emprendedor: boolean = false;  // Para verificar si es emprendedor
  repartidorData: any;  // Para almacenar los datos del repartidor
  emprendedorData: any;  // Para almacenar los datos del emprendedor
  notificaciones: Notificacion[] = [];
  notificacionesNoLeidas: Notificacion[] = [];
  notificacionesLeidas: Notificacion[] = [];
  mostrarNotificacionesLista: boolean = false;
  mostrarModalNotificaciones = false;
  segmentoActual: string = 'noLeidas'; // Por defecto, mostrar no leídas


  constructor(
    private menuCtrl: MenuController,
    private repartidorService: RepartidorService,
    private notificacionesService: NotificacionesService,
    private emprendedorService: EmprendedorService,
    private router: Router,
    private authService: AuthServiceService // Inyectar el AuthService para recuperar los datos
  ) { }

  ngOnInit() {
    this.cargarUsuario();  // Cargar los datos del usuario al iniciar la página
    this.cargarNotificaciones();
    this.menuCtrl.enable(true);  // Asegúrate de habilitar el menú cuando la página se carga
  }

  // Refresco page
  doRefresh(event: any) {
    this.cargarUsuario();  // Cargar los datos del usuario al iniciar la página
    event.target.complete();
  }


  // Abrir menú
  openMenu() {
    this.menuCtrl.open();
  }

  // Cerrar menú
  closeMenu() {
    this.menuCtrl.close();
  }


  async cargarUsuario() {
    const usuario = await this.authService.getDecryptedUserData(); // Obtener datos desencriptados

    if (usuario) {
      // Verificar el rol del usuario basado en id_role
      if (usuario.id_role === 3) { // id_role 3 corresponde a Repartidor
        this.repartidor = true;
        this.emprendedor = false;
        this.repartidorData = await lastValueFrom(this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor));
        this.emprendedorData = null; // Asegurarse de que los datos de emprendedor estén vacíos
      } else if (usuario.id_role === 2) { // id_role 2 corresponde a Emprendedor
        this.emprendedor = true;
        this.repartidor = false;
        this.emprendedorData = await lastValueFrom(this.emprendedorService.obtenerEmprendedorPorId(usuario.id_emprendedor));
        this.repartidorData = null; // Asegurarse de que los datos de repartidor estén vacíos
      } else {
        // Si el id_role no corresponde a ninguno, manejar como un caso de error o redirección
        this.repartidor = false;
        this.emprendedor = false;
        this.repartidorData = null;
        this.emprendedorData = null;
        console.error('El usuario no tiene un rol válido.');
        // Puedes redirigir al login o mostrar un mensaje de error
      }
    } else {
      // Si no hay datos de usuario, establecer valores por defecto
      this.repartidor = false;
      this.emprendedor = false;
      this.repartidorData = null;
      this.emprendedorData = null;
      console.error('No se encontraron datos de usuario.');
    }
  }



  // Navegar al perfil
  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  // Cerrar sesión
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true }); // Redirigir y bloquear acceso a páginas previas
  }

  goToConfig() {
    this.router.navigate(['/configuracion']);
  }

  goToSupport() {
    this.router.navigate(['/soporte']);
  }


  

  // Emprendedor 

  // Navegar a la página de gestión de productos
  gestionarProductos() {
    this.router.navigate(['/productos']);
  }

  // Navegar a la página de gestión de lotes
  gestionarLotes() {
    this.router.navigate(['/gestionar-lote']);
  }

  // Navegar a la página de pedidos
  verPedidos() {
    this.router.navigate(['/pedidos']);
  }

  gestionarRepartidores() {
    this.router.navigate(['/gestionar-repartidor']);
  }

  gestionarSolicitudServicio() {
    this.router.navigate(['/solicitud-servicio']);
  }


  // Repartidor

  async cargarNotificaciones() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario && usuario.id_repartidor) {
        const idRoleRepartidor = 3; // ID del rol 'repartidor'
        const notificaciones = await firstValueFrom(
          this.notificacionesService.obtenerNotificacionesPorRolYUsuario(
            idRoleRepartidor,
            usuario.id_repartidor
          )
        );

        // Separar notificaciones en leídas y no leídas
        this.notificacionesNoLeidas = notificaciones.filter((n) => !n.leido);
        this.notificacionesLeidas = notificaciones.filter((n) => n.leido);
      } else {
        console.warn('No hay notificaciones disponibles para el usuario.');
      }
    } catch (error) {
      console.error('Error al cargar las notificaciones:', error);
    }
  }

  mostrarNotificaciones() {
    this.mostrarNotificacionesLista = !this.mostrarNotificacionesLista;
  }
  
  abrirModalNotificaciones() {
    this.mostrarModalNotificaciones = true;
  }

  cerrarModalNotificaciones() {
    this.mostrarModalNotificaciones = false;
  }

  cambiarSegmento(event: any) {
    this.segmentoActual = event.detail.value;
  }

  async marcarNotificacionComoLeida(idNotificacion: number) {
    try {
      await firstValueFrom(
        this.notificacionesService.marcarComoLeida(idNotificacion)
      );
      // Mover notificación de no leídas a leídas
      const notificacionMarcada = this.notificacionesNoLeidas.find(
        (n) => n.id_notificacion === idNotificacion
      );
      if (notificacionMarcada) {
        notificacionMarcada.leido = true;
        this.notificacionesLeidas.push(notificacionMarcada);
        this.notificacionesNoLeidas = this.notificacionesNoLeidas.filter(
          (n) => n.id_notificacion !== idNotificacion
        );
      }
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  }

  async eliminarNotificacion(idNotificacion: number) {
    try {
      await firstValueFrom(
        this.notificacionesService.eliminarNotificacion(idNotificacion)
      );
      // Eliminar de ambas listas
      this.notificacionesNoLeidas = this.notificacionesNoLeidas.filter(
        (n) => n.id_notificacion !== idNotificacion
      );
      this.notificacionesLeidas = this.notificacionesLeidas.filter(
        (n) => n.id_notificacion !== idNotificacion
      );
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
    }
  }

  verRutas() {
    this.router.navigate(['/rutas']);
  }

  verHistorialEntregas() {
    this.router.navigate(['/historial-entregas']);
  }

}
