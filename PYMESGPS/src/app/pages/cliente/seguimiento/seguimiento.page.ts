import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { firstValueFrom } from 'rxjs';
import { SolicitudServicioService } from 'src/app/services/solicitud-servicio/solicitudservicio.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
})
export class SeguimientoPage implements OnInit {
  codigoSeguimiento: string = '';
  solicitud: SolicitudServicio | null = null;
  error: string | null = null;

  constructor(
    private router: Router,
    private solicitudServicioService: SolicitudServicioService,
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.codigoSeguimiento = navigation.extras.state['codigo'] || '';
    }
  }

  ngOnInit() {
    if (this.codigoSeguimiento) {
      this.buscarSolicitud();
    } else {
      this.error = 'No se proporcionó un código de seguimiento.';
      this.mostrarMensaje(this.error, 'danger');
    }
  }

  async buscarSolicitud() {
    try {
      const solicitud = await firstValueFrom(
        this.solicitudServicioService.obtenerSolicitudPorCodigo(this.codigoSeguimiento)
      );

      if (solicitud) {
        this.solicitud = solicitud;
        this.mostrarMensaje('Solicitud encontrada con éxito.', 'success');
      } else {
        this.error = 'No se encontró ninguna solicitud con este código.';
        this.mostrarMensaje(this.error, 'danger');
      }
    } catch (error) {
      console.error('Error al buscar la solicitud:', error);
      this.error = 'Error al buscar la solicitud. Inténtalo de nuevo más tarde.';
      this.mostrarMensaje(this.error, 'danger');
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
    this.router.navigate(['/home-cliente']);
  }
}
