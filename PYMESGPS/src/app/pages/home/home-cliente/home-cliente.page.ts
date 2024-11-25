import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { Notificacion } from 'src/app/models/notificacion';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { LoteService } from 'src/app/services/lote/lote.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {
  cliente: boolean = false;
  clienteData: any;
  codigoSeguimiento: string = '';
  notificaciones: Notificacion[] = [];
  notificacionesNoLeidas: Notificacion[] = [];
  notificacionesLeidas: Notificacion[] = [];
  mostrarNotificacionesLista: boolean = false;
  mostrarModalNotificaciones = false;
  segmentoActual: string = 'noLeidas'; 

  constructor(
    private menuCtrl: MenuController,
    private clienteService: ClienteService,
    private authService: AuthServiceService,
    private loteService: LoteService,
    private notificacionesService: NotificacionesService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarCliente();
    this.cargarNotificaciones();
    this.menuCtrl.enable(true);
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarCliente() {
    const usuario = await this.authService.getDecryptedUserData();
    if (usuario && usuario.id_cliente) {
      this.cliente = true;
      const clienteInfo = await lastValueFrom(this.clienteService.obtenerClientePorId(usuario.id_cliente));
      this.clienteData = Array.isArray(clienteInfo) ? clienteInfo[0] : clienteInfo;
    } else {
      this.cliente = false;
      this.clienteData = null;
    }
  }

  async cargarNotificaciones() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario && usuario.id_cliente) {
        const idRoleCliente = 1; // Ajusta este valor según el ID numérico del rol 'cliente'
        const notificaciones = await firstValueFrom(
          this.notificacionesService.obtenerNotificacionesPorRolYUsuario(
              idRoleCliente, 
              usuario.id_cliente
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
      await lastValueFrom(
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

  private async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  async rastrearPedido() {
    if (this.codigoSeguimiento) {
      try {
        const solicitud = await firstValueFrom(
          this.loteService.obtenerSolicitudPorCodigoSeguimiento(this.codigoSeguimiento)
        );
  
        if (solicitud) {
          this.router.navigate(['/seguimiento'], { state: { codigo: this.codigoSeguimiento } });
        } else {
          console.error('No se encontró ninguna solicitud con el código de seguimiento proporcionado.');
        }
      } catch (error) {
        console.error('Error al buscar la solicitud:', error);
      }
    } else {
      console.error('Por favor ingresa un código de seguimiento');
    }
  }  

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
}
