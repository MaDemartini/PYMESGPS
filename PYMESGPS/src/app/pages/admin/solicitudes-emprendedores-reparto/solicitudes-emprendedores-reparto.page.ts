import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudEmprendedorRepartoService } from 'src/app/services/solicitud-emprendedor-reparto/solicitud-emprendedor-reparto.service';
import { lastValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes-emprendedores-reparto',
  templateUrl: './solicitudes-emprendedores-reparto.page.html',
  styleUrls: ['./solicitudes-emprendedores-reparto.page.scss'],
})
export class SolicitudesEmprendedoresRepartoPage implements OnInit {
  solicitudesPendientes: any[] = [];

  constructor(
    private solicitudEmprendedorRepartoService: SolicitudEmprendedorRepartoService, 
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarSolicitudesPendientes();
  }

  // Cargar todas las solicitudes pendientes
  cargarSolicitudesPendientes() {
    this.solicitudEmprendedorRepartoService.obtenerTodasSolicitudes().subscribe({
      next: (solicitudes) => {
        this.solicitudesPendientes = solicitudes;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar las solicitudes', 'danger');
        console.error('Error al cargar las solicitudes', error);
      },
    });
  }

  async actualizarEstadoSolicitud(id_solicitud: number, nuevoEstado: string) {
    let estadoId: number;

    // Mapear el estado al correspondiente ID en la tabla
    switch (nuevoEstado) {
      case 'aprobada':
        estadoId = 2;  // Estado "aprobada"
        break;
      case 'rechazada':
        estadoId = 3;  // Estado "rechazada"
        break;
      default:
        estadoId = 1;  // Por defecto, "pendiente"
    }

    if (id_solicitud) {
      try {
        await lastValueFrom(this.solicitudEmprendedorRepartoService.cambiarEstadoSolicitud(id_solicitud, estadoId));
        this.mostrarMensaje('Estado de solicitud actualizado correctamente.', 'success');
        this.cargarSolicitudesPendientes();  // Refrescar la lista de solicitudes
      } catch (error) {
        this.mostrarMensaje('Error al actualizar el estado.', 'danger');
        console.error('Error al actualizar el estado', error);
      }
    } else {
      this.mostrarMensaje('ID de solicitud no válido.', 'danger');
      console.error('ID de solicitud no válido:', id_solicitud);
    }
  }

  private async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: color === 'danger' ? 'warning' : 'checkmark-circle',
        }
      ]
    });
    toast.present();
  }

  volver() {
    this.router.navigate(['/home-admin']); 
  }
}
