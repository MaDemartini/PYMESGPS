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
  codigoSeguimiento: string;
  solicitud: SolicitudServicio | null = null; 
  error: string | null = null; 

  constructor(
    private router: Router,
    private solicitudServicioService: SolicitudServicioService,
    private toastController: ToastController
  ) {
    // Obtiene el código del estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.codigoSeguimiento = navigation.extras.state['codigo']; 
    } else {
      this.codigoSeguimiento = '';
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
      this.solicitud = await firstValueFrom(this.solicitudServicioService.obtenerSolicitudPorCodigo(this.codigoSeguimiento));
      if (!this.solicitud) {
        this.error = 'No se encontró la solicitud con este código.';
        this.mostrarMensaje(this.error, 'danger');
      } else {
        this.mostrarMensaje('Solicitud encontrada con éxito.', 'success');
      }
    } catch (error) {
      this.error = 'Error al buscar la solicitud. Inténtalo de nuevo más tarde.';
      this.mostrarMensaje(this.error, 'danger');
      console.error('Error al buscar la solicitud:', error);
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
