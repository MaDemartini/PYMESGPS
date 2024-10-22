import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { EstadoSolicitudServicio } from 'src/app/models/estado_solicitud_servicio'; 
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolicitudServicioService {
  private path = 'solicitud_servicio'; 
  private pathEstado = 'estado_solicitud_servicio';

  constructor(private apiService: ApiConfigService) {}

  // Obtener todas las solicitudes de servicio
  obtenerSolicitudes(): Observable<SolicitudServicio[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Obtener una solicitud de servicio por código
  obtenerSolicitudPorCodigo(codigo: string): Observable<SolicitudServicio> {
    const params = new HttpParams().set('codigo_seguimiento', `eq.${codigo}`);
    return this.apiService.get<SolicitudServicio>(`${this.path}?select=*,cliente(nombre_cliente),estado_solicitud(nombre_estado)`, { params }).pipe(catchError(this.handleError));
  }

  // Obtener una solicitud de servicio por ID
  obtenerSolicitudPorId(id: number): Observable<SolicitudServicio> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, { params }).pipe(catchError(this.handleError));
  }

  // Crear una nueva solicitud de servicio
  agregarSolicitudServicio(solicitud: SolicitudServicio): Observable<SolicitudServicio> {
    return this.apiService.post<SolicitudServicio>(this.path, solicitud).pipe(
      map((response: any) => {
        if (response && response.length > 0 && response[0].id_solicitud) {
          return response[0];
        } else {
          throw new Error('Respuesta vacía o no válida');
        }
      }),
      catchError((error) => {
        console.error('Error al agregar la solicitud:', error);
        return throwError(() => new Error('Error al agregar la solicitud'));
      })
    );
  }  

  // Actualizar una solicitud de servicio existente
  actualizarSolicitud(id: number, solicitudActualizar: Partial<SolicitudServicio>): Observable<SolicitudServicio> {
    return this.apiService.put<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, solicitudActualizar).pipe(catchError(this.handleError));
  }

  // Eliminar una solicitud de servicio
  eliminarSolicitud(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_solicitud=eq.${id}`);
  } 
  

  // Obtener estados de solicitud de servicio
  obtenerEstadosSolicitud(): Observable<EstadoSolicitudServicio[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<EstadoSolicitudServicio[]>(this.pathEstado, { params }).pipe(catchError(this.handleError));
  }

  // Simulación para obtener emprendedor logueado
  obtenerEmprendedorLogueado(id_emprendedor: number): Observable<boolean> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<any[]>(this.path, { params }).pipe(
      map((emprendedores: any[]) => emprendedores.length > 0),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de solicitudes de servicio'));
  }
}
