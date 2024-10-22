import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CrearSolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/crearSolicitud-repartidor';
import { ApiConfigService } from '../apiconfig/apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEmprendedorRepartoService {
  private path = 'solicitud_repartidor';

  constructor(private apiService: ApiConfigService) {}

  // Obtener todas las solicitudes pendientes para el administrador
  obtenerTodasSolicitudes(): Observable<CrearSolicitudRepartidor[]> {
    return this.apiService.get<CrearSolicitudRepartidor[]>(`${this.path}?id_estado_solicitud=eq.1&select=*,estado_solicitud_repartidor(nombre_estado)`)
      .pipe(catchError(this.handleError));
  }

  // Cambiar el estado de la solicitud (Admin)
  cambiarEstadoSolicitud(id_solicitud: number, id_estado: number): Observable<void> {
    return this.apiService.patch<void>(
      `${this.path}?id_solicitud=eq.${id_solicitud}`, 
      { id_estado_solicitud: id_estado }
    ).pipe(catchError(this.handleError));
  }

  // Obtener una solicitud específica por ID
  obtenerSolicitudPorId(id_solicitud: number): Observable<CrearSolicitudRepartidor> {
    const params = new HttpParams().set('id_solicitud_repartidor', `eq.${id_solicitud}`);
    return this.apiService.get<CrearSolicitudRepartidor[]>(this.path, { params })
      .pipe(
        map((solicitudes: CrearSolicitudRepartidor[]) => solicitudes[0]),
        catchError(this.handleError)
      );
  }

  // Eliminar una solicitud de repartidor
  eliminarSolicitudRepartidor(id_solicitud: number): Observable<void> {
    const data = { id_estado_solicitud: 4 };
    return this.apiService.put<void>(`${this.path}?id_solicitud_repartidor=eq.${id_solicitud}`, data).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de solicitudes'));
  }
}
