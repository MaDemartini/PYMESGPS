import { Injectable } from '@angular/core';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Observable, throwError } from 'rxjs';
import { Notificacion } from 'src/app/models/notificacion';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private path = 'notificaciones';

  constructor(private apiService: ApiConfigService) {}

  // Obtener notificaciones por id_usuario
  obtenerNotificaciones(id_usuario: number): Observable<Notificacion[]> {
    const params = new HttpParams().set('id_usuario', `eq.${id_usuario}`);
    return this.apiService.get<Notificacion[]>(this.path, { params }).pipe(
      map((response: HttpResponse<Notificacion[]>) => {
        const notificaciones = response.body;
        if (!notificaciones) {
          throw new Error(`No se encontraron notificaciones para el usuario con ID ${id_usuario}.`);
        }
        return notificaciones;
      }),
      catchError(this.handleError)
    );
  }

  // Crear una nueva notificación
  crearNotificacion(notificacion: Notificacion): Observable<Notificacion> {
    return this.apiService.post<Notificacion>(this.path, notificacion).pipe(
      map((response: HttpResponse<Notificacion>) => {
        const notificacionCreada = response.body;
        if (!notificacionCreada) {
          throw new Error('Error al crear la notificación.');
        }
        return notificacionCreada;
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar una notificación
  eliminarNotificacion(id_notificacion: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_notificacion=eq.${id_notificacion}`).pipe(
      map(() => {
        return; // No se retorna nada ya que es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  // Marcar notificación como leída
  marcarComoLeida(id_notificacion: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_notificacion=eq.${id_notificacion}`, { leido: true }).pipe(
      map(() => {
        return; // No se retorna nada ya que es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  obtenerNotificacionesPorRolYUsuario(idrole: number, idUsuario: number): Observable<Notificacion[]> {
    const params = new HttpParams()
      .set('id_role', `eq.${idrole}`)
      .set('id_usuario', `eq.${idUsuario}`);
    return this.apiService.get<Notificacion[]>(this.path, { params }).pipe(
      map((response: HttpResponse<Notificacion[]>) => {
        const notificaciones = response.body;
        if (!notificaciones) {
          throw new Error(`No se encontraron notificaciones para el rol ${idrole} y usuario con ID ${idUsuario}.`);
        }
        return notificaciones;
      }),
      catchError(this.handleError)
    );
  }
  
  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de notificaciones'));
  }
}
