import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudEmprendedorRepartoService } from 'src/app/services/solicitud-emprendedor-reparto/solicitud-emprendedor-reparto.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-solicitudes-emprendedores-reparto',
  templateUrl: './solicitudes-emprendedores-reparto.page.html',
  styleUrls: ['./solicitudes-emprendedores-reparto.page.scss'],
})
export class SolicitudesEmprendedoresRepartoPage implements OnInit {
  solicitudesPendientes: any[] = [];

  constructor(private solicitudEmprendedorRepartoService: SolicitudEmprendedorRepartoService, private router: Router) {}

  ngOnInit() {
    this.cargarSolicitudesPendientes();
  }

  // Cargar todas las solicitudes pendientes
  cargarSolicitudesPendientes() {
    this.solicitudEmprendedorRepartoService.obtenerTodasSolicitudes().subscribe({
      next: (solicitudes) => {
        //console.log('Solicitudes:', solicitudes);  
        this.solicitudesPendientes = solicitudes;
      },
      error: (error) => {
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
        console.info(`Estado de la solicitud con ID: ${id_solicitud} actualizado correctamente.`);
        this.cargarSolicitudesPendientes();  // Refrescar la lista de solicitudes
      } catch (error) {
        console.error('Error al actualizar el estado', error);
      }
    } else {
      console.error('ID de solicitud no válido:', id_solicitud);
    }
  }
 
  volver() {
    this.router.navigate(['/home-admin']); 
  }
}
