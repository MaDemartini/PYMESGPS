import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { CrearSolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/crearSolicitud-repartidor';
import { SolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/solicitud-repartidor';

@Injectable({
  providedIn: 'root'
})
export class SolicitudRepartidorService {
  private path = 'solicitud_repartidor';

  constructor(private apiService: ApiConfigService) {}

  obtenerSolicitudesEmprendedor(id_emprendedor: number): Observable<SolicitudRepartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<SolicitudRepartidor[]>(`${this.path}?select=*,estado_solicitud_repartidor(nombre_estado)`, { params }).pipe(catchError(this.handleError));
  }

  obtenerSolicitudesAprobadas(id_emprendedor: number): Observable<SolicitudRepartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`).set('id_estado_solicitud', 'eq.2'); 
    return this.apiService.get<SolicitudRepartidor[]>(`${this.path}`, { params }).pipe(catchError(this.handleError));
  }

  marcarComoRegistrado(id_solicitud: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_solicitud=eq.${id_solicitud}`, { registrado: true }).pipe(catchError(this.handleError));
  }

  crearSolicitudRepartidor(solicitud: CrearSolicitudRepartidor): Observable<CrearSolicitudRepartidor> {
    return this.apiService.post<CrearSolicitudRepartidor>(this.path, solicitud).pipe(catchError(this.handleError));
  }

  obtenerSolicitudesPendientes(id_emprendedor: number): Observable<SolicitudRepartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`).set('id_estado_solicitud', 'eq.1'); 
    return this.apiService.get<SolicitudRepartidor[]>(`${this.path}?select=*,estado_solicitud_repartidor(nombre_estado)`, { params }).pipe(catchError(this.handleError));
  }

  aceptarSolicitud(id_solicitud: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_solicitud=eq.${id_solicitud}`, { id_estado_solicitud: 2 }).pipe(catchError(this.handleError));
  }

  rechazarSolicitud(id_solicitud: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_solicitud=eq.${id_solicitud}`, { id_estado_solicitud: 3 }).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de solicitudes repartidor'));
  }
}
