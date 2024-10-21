import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrearSolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/crearSolicitud-repartidor';
import { ApiConfigService } from '../apiconfig/apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEmprendedorRepartoService {
  private path = 'solicitud_repartidor';  // Definimos el path base

  constructor(private apiService: ApiConfigService) {}

  // Obtener todas las solicitudes pendientes para el administrador
  obtenerTodasSolicitudes(): Observable<CrearSolicitudRepartidor[]> {
    // Aseguramos que se incluyan los datos de estado_solicitud_repartidor
    return this.apiService.get<CrearSolicitudRepartidor[]>(`${this.path}?id_estado_solicitud=eq.1&select=*,estado_solicitud_repartidor(nombre_estado)`);
  }

  // Cambiar el estado de la solicitud (Admin)
  cambiarEstadoSolicitud(id_solicitud: number, id_estado: number): Observable<void> {
    return this.apiService.patch<void>(
      `${this.path}?id_solicitud=eq.${id_solicitud}`, 
      { id_estado_solicitud: id_estado }  // Enviamos el nuevo estado
    );
  }

  // Obtener una solicitud específica por ID
  obtenerSolicitudPorId(id_solicitud: number): Observable<CrearSolicitudRepartidor> {
    const params = new HttpParams().set('id_solicitud_repartidor', `eq.${id_solicitud}`);
    return this.apiService.get<CrearSolicitudRepartidor[]>(this.path, { params })
      .pipe(
        map((solicitudes: CrearSolicitudRepartidor[]) => solicitudes[0])  // Obtener el primer resultado
      );
  }

  // Eliminar una solicitud de repartidor (cambiar estado a inactivo o eliminar)
  eliminarSolicitudRepartidor(id_solicitud: number): Observable<void> {
    const data = { id_estado_solicitud: 4 }; 
    return this.apiService.put<void>(`${this.path}?id_solicitud_repartidor=eq.${id_solicitud}`, data);
  }
}
