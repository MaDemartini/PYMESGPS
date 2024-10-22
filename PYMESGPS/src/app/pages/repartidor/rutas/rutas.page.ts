import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  repartidor: any;
  solicitudesPendientes: any[] = [];
  solicitudesAprobadas: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private repartidorService: RepartidorService,
    private solicitudRepartidorService: SolicitudRepartidorService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarRepartidor();
    await this.cargarSolicitudes();
  }

  async cargarRepartidor() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario && usuario.id_repartidor) {
        this.repartidor = await firstValueFrom(this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor));
      }
    } catch (error) {
      console.error('Error al cargar datos del repartidor', error);
    }
  }

  async cargarSolicitudes() {
    try {
      if (this.repartidor) {
        // Obtener solicitudes de acuerdo al ID del repartidor
        this.solicitudesPendientes = await firstValueFrom(this.solicitudRepartidorService.obtenerSolicitudesPendientes(this.repartidor.id_repartidor));
        this.solicitudesAprobadas = await firstValueFrom(this.solicitudRepartidorService.obtenerSolicitudesAprobadas(this.repartidor.id_repartidor));
  
        // Asegúrate de que las solicitudes contengan la información del cliente
        this.solicitudesPendientes.forEach(solicitud => {
          solicitud.nombre_cliente = solicitud.cliente?.nombre_completo; 
          solicitud.direccion_cliente = solicitud.cliente?.direccion;
        });
  
        this.solicitudesAprobadas.forEach(solicitud => {
          solicitud.nombre_cliente = solicitud.cliente?.nombre_completo; 
          solicitud.direccion_cliente = solicitud.cliente?.direccion; 
        });
      }
    } catch (error) {
      console.error('Error al cargar las solicitudes', error);
    }
  }
  

  async aceptarSolicitud(id_solicitud: number) {
    try {
      await firstValueFrom(this.solicitudRepartidorService.aceptarSolicitud(id_solicitud));
      this.mostrarMensaje('Solicitud aceptada', 'success');
      await this.cargarSolicitudes(); // Recargar solicitudes
    } catch (error) {
      console.error('Error al aceptar la solicitud', error);
    }
  }

  async rechazarSolicitud(id_solicitud: number) {
    try {
      await firstValueFrom(this.solicitudRepartidorService.rechazarSolicitud(id_solicitud));
      this.mostrarMensaje('Solicitud rechazada', 'danger');
      await this.cargarSolicitudes(); // Recargar solicitudes
    } catch (error) {
      console.error('Error al rechazar la solicitud', error);
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

  volver() {
    this.router.navigate(['/home']);
  }

  async escanearQR(id_solicitud: number) {
    console.log(`Escaneando QR para la solicitud: ${id_solicitud}`);
  }
  
}
