import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
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
    const params = new HttpParams().set('select', '*,estado_solicitud_repartidor(nombre_estado)').set('id_estado_solicitud', 'eq.1');
    return this.apiService.get<CrearSolicitudRepartidor[]>(this.path, { params }).pipe(
      map((response: HttpResponse<CrearSolicitudRepartidor[]>) => {
        const solicitudes = response.body;
        if (!solicitudes) {
          throw new Error('No se encontraron solicitudes pendientes.');
        }
        return solicitudes;
      }),
      catchError(this.handleError)
    );
  }

  // Cambiar el estado de la solicitud (Admin)
  cambiarEstadoSolicitud(id_solicitud: number, id_estado: number): Observable<void> {
    return this.apiService.patch<void>(
      `${this.path}?id_solicitud=eq.${id_solicitud}`, 
      { id_estado_solicitud: id_estado }
    ).pipe(
      map(() => {
        return; // Retorno vacío porque es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  // Obtener una solicitud específica por ID
  obtenerSolicitudPorId(id_solicitud: number): Observable<CrearSolicitudRepartidor> {
    const params = new HttpParams().set('id_solicitud_repartidor', `eq.${id_solicitud}`);
    return this.apiService.get<CrearSolicitudRepartidor[]>(this.path, { params }).pipe(
      map((response: HttpResponse<CrearSolicitudRepartidor[]>) => {
        const solicitudes = response.body;
        if (!solicitudes || solicitudes.length === 0) {
          throw new Error(`No se encontró la solicitud con ID ${id_solicitud}.`);
        }
        return solicitudes[0];
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar una solicitud de repartidor
  eliminarSolicitudRepartidor(id_solicitud: number): Observable<void> {
    const data = { id_estado_solicitud: 4 };
    return this.apiService.put<void>(`${this.path}?id_solicitud_repartidor=eq.${id_solicitud}`, data).pipe(
      map(() => {
        return; // Retorno vacío porque es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de solicitudes'));
  }
}
