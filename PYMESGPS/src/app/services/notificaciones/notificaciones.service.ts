import { Injectable } from '@angular/core';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Observable, throwError } from 'rxjs';
import { Notificacion } from 'src/app/models/notificacion';
import { HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private path = 'notificaciones';

  constructor(private apiService: ApiConfigService) {}

  // Obtener notificaciones por id_usuario
  obtenerNotificaciones(id_usuario: number): Observable<Notificacion[]> {
    const params = new HttpParams()
        .set('id_usuario', `eq.${id_usuario}`);

    return this.apiService.get<Notificacion[]>(this.path, { params }).pipe(catchError(this.handleError));
}

  // Crear una nueva notificación
  crearNotificacion(notificacion: Notificacion): Observable<Notificacion> {
    return this.apiService.post<Notificacion>(this.path, notificacion).pipe(catchError(this.handleError));
  }

  // Marcar notificación como leída
  marcarComoLeida(id_notificacion: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_notificacion=eq.${id_notificacion}`, { leido: true }).pipe(catchError(this.handleError));
  }

  // Eliminar una notificación
  eliminarNotificacion(id_notificacion: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_notificacion=eq.${id_notificacion}`).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de notificaciones'));
  }
}
