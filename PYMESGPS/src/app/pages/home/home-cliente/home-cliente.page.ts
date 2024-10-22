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
  mostrarNotificacionesLista: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private clienteService: ClienteService,
    private authService: AuthServiceService,
    private loteService: LoteService,
    private notificacionesService: NotificacionesService,
    private router: Router,
    private toastController: ToastController
  ) {}

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
        this.notificaciones = await lastValueFrom(
          this.notificacionesService.obtenerNotificaciones(usuario.id_cliente) 
        );
      } else {
        console.warn('El usuario no es un cliente válido.');
      }
    } catch (error) {
      console.error('Error al cargar las notificaciones:', error);
    }
  }

  
  async marcarNotificacionComoLeida(idNotificacion: number) {
    try {
      await lastValueFrom(this.notificacionesService.marcarComoLeida(idNotificacion));
      this.notificaciones = this.notificaciones.filter(n => n.id_notificacion !== idNotificacion);
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  }

  mostrarNotificaciones() {
    this.mostrarNotificacionesLista = !this.mostrarNotificacionesLista;
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
        const lote = await firstValueFrom( await this.loteService.obtenerSolicitudPorCodigoSeguimiento(this.codigoSeguimiento));
  
        if (lote) {
          // Si se encuentra el lote, navega a la página de seguimiento
          this.router.navigate(['/seguimiento'], { state: { codigo: this.codigoSeguimiento } });
        } else {
          console.error('No se encontró ningún lote con el código de seguimiento proporcionado.');
          // Puedes mostrar un mensaje al usuario aquí
        }
      } catch (error) {
        console.error('Error al buscar el lote:', error);
      }
    } else {
      console.error('Por favor ingresa un código de seguimiento');
    }
  }
  
  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  goToConfig() {
    this.router.navigate(['/configuracion']);
  }

  goToSupport() {
    this.router.navigate(['/soporte']);
  }
}
