import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { CrearSolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/crearSolicitud-repartidor';
import { SolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/solicitud-repartidor';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { HistorialEntregaRepartidor } from 'src/app/models/historial_entrega_repartidor';
import { Notificacion } from 'src/app/models/notificacion';

@Injectable({
  providedIn: 'root'
})
export class SolicitudRepartidorService {
  private path = 'solicitud_repartidor';

  constructor(private apiService: ApiConfigService) { }

  // Obtener solicitudes de un emprendedor
  obtenerSolicitudesEmprendedor(id_emprendedor: number): Observable<SolicitudRepartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<SolicitudRepartidor[]>(`${this.path}?select=*,estado_solicitud_repartidor(nombre_estado)`, { params }).pipe(
      map((response: HttpResponse<SolicitudRepartidor[]>) => {
        const solicitudes = response.body;
        if (!solicitudes) {
          throw new Error(`No se encontraron solicitudes para el emprendedor con ID ${id_emprendedor}.`);
        }
        return solicitudes;
      }),
      catchError(this.handleError)
    );
  }

  // Marcar una solicitud como registrada
  marcarComoRegistrado(id_solicitud: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_solicitud=eq.${id_solicitud}`, { registrado: true }).pipe(
      map(() => {
        return; // No se retorna nada ya que es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  // Crear una nueva solicitud de repartidor
  crearSolicitudRepartidor(solicitud: CrearSolicitudRepartidor): Observable<CrearSolicitudRepartidor> {
    return this.apiService.post<CrearSolicitudRepartidor>(this.path, solicitud).pipe(
      map((response: HttpResponse<CrearSolicitudRepartidor>) => {
        const solicitudCreada = response.body;
        if (!solicitudCreada) {
          throw new Error('Error al crear la solicitud de repartidor.');
        }
        return solicitudCreada;
      }),
      catchError(this.handleError)
    );
  }

  registrarHistorialEntrega(historial: HistorialEntregaRepartidor): Observable<void> {
    return this.apiService.post<void>('historial_entrega_repartidor', historial).pipe(
      map(() => { }),
      catchError(this.handleError)
    );
  }

  // Obtener solicitudes aprobadas de un emprendedor
  obtenerSolicitudesAprobadas(id_repartidor: number): Observable<SolicitudServicio[]> {
    const params = new HttpParams()
      .set('id_repartidor', `eq.${id_repartidor}`)
      .set('id_estado_solicitud', 'eq.2'); // En proceso

    return this.apiService
      .get<SolicitudServicio[]>(
        `solicitud_servicio?select=id_solicitud,cliente(id_cliente,nombre_completo,direccion),id_repartidor,id_estado_solicitud,estado_solicitud_servicio!fk_estado_solicitud_servicio(nombre_estado),lote(nombre_lote,codigo_seguimiento)`,
        { params }
      )
      .pipe(
        map((response: HttpResponse<SolicitudServicio[]>) => {
          const solicitudes = response.body;
          if (!solicitudes || solicitudes.length === 0) {
            throw new Error(`No se encontraron solicitudes aprobadas para el repartidor con ID ${id_repartidor}.`);
          }
          return solicitudes;
        }),
        catchError(this.handleError)
      );
  }

  // Obtener solicitudes pendientes desde 'solicitud_servicio'
  obtenerSolicitudesPorEstado(id_repartidor: number, estado: number): Observable<SolicitudServicio[]> {
    const params = new HttpParams()
      .set('id_repartidor', `eq.${id_repartidor}`)
      .set('id_estado_solicitud', `eq.${estado}`); // Estado dinámico

    return this.apiService
      .get<SolicitudServicio[]>(
        `solicitud_servicio?select=id_solicitud,cliente(id_cliente,nombre_completo,direccion,region,comuna,telefono),lote(id_lote,nombre_lote,codigo_seguimiento),id_estado_solicitud`,
        { params }
      )
      .pipe(
        map((response: HttpResponse<SolicitudServicio[]>) => response.body || []),
        catchError(this.handleError)
      );
  }

  // Crear una nueva notificación
  enviarNotificacionCliente(notificacion: Notificacion): Observable<Notificacion> {
    return this.apiService.post<Notificacion>('notificaciones', notificacion).pipe(
      map((response: HttpResponse<Notificacion>) => {
        const notificacionCreada = response.body;
        if (!notificacionCreada) {
          throw new Error('Error al crear la notificación.');
        }
        return notificacionCreada; // Retorna la notificación creada
      }),
      catchError(this.handleError)
    );
  }


  // Aceptar una solicitud
  aceptarSolicitud(id_solicitud: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_solicitud=eq.${id_solicitud}`, { id_estado_solicitud: 2 }).pipe(
      map(() => {
        return; // No se retorna nada ya que es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  // Método para eliminar el repartidor
  eliminarRepartidor(id_solicitud: number): Observable<any> {
    return this.apiService.delete(`${this.path}?id_solicitud=eq.${id_solicitud}`).pipe(
      catchError(this.handleError)
    );
  }

  // Rechazar una solicitud
  rechazarSolicitud(id_solicitud: number): Observable<void> {
    return this.apiService.patch<void>(`${this.path}?id_solicitud=eq.${id_solicitud}`, { id_estado_solicitud: 3 }).pipe(
      map(() => {
        return; // No se retorna nada ya que es de tipo void
      }),
      catchError(this.handleError)
    );
  }


  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de solicitudes repartidor'));
  }
}
