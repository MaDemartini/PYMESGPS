import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
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

  constructor(private apiService: ApiConfigService) { }

  // Obtener todas las solicitudes de servicio
  obtenerSolicitudes(): Observable<SolicitudServicio[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio[]>(this.path, { params }).pipe(
      map((response: HttpResponse<SolicitudServicio[]>) => {
        const solicitudes = response.body;
        if (!solicitudes) {
          throw new Error('No se encontraron solicitudes de servicio.');
        }
        return solicitudes;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener una solicitud de servicio por ID
  obtenerSolicitudPorId(id: number): Observable<SolicitudServicio> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, { params }).pipe(
      map((response: HttpResponse<SolicitudServicio>) => {
        const solicitud = response.body;
        if (!solicitud) {
          throw new Error(`No se encontró la solicitud con ID ${id}.`);
        }
        return solicitud;
      }),
      catchError(this.handleError)
    );
  }

  // Crear una nueva solicitud de servicio
  agregarSolicitudServicio(solicitud: SolicitudServicio): Observable<SolicitudServicio> {
    return this.apiService.post<SolicitudServicio>(this.path, solicitud).pipe(
      map((response: HttpResponse<SolicitudServicio>) => {
        const solicitudCreada = response.body;
        if (!solicitudCreada) {
          throw new Error('Error al crear la solicitud de servicio.');
        }
        return solicitudCreada;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar una solicitud de servicio existente
  actualizarSolicitud(id: number, solicitudActualizar: Partial<SolicitudServicio>): Observable<SolicitudServicio> {
    return this.apiService.put<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, solicitudActualizar).pipe(
      map((response: HttpResponse<SolicitudServicio>) => {
        const solicitudActualizada = response.body;
        if (!solicitudActualizada) {
          throw new Error(`No se pudo actualizar la solicitud con ID ${id}.`);
        }
        return solicitudActualizada;
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar una solicitud de servicio
  eliminarSolicitud(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_solicitud=eq.${id}`).pipe(
      map(() => {
        return; // No se retorna nada ya que es de tipo void
      }),
      catchError(this.handleError)
    );
  }

  // Obtener una solicitud de servicio por código
  obtenerSolicitudPorCodigo(codigo: string): Observable<SolicitudServicio> {
    const params = new HttpParams()
      .set('select', 'id_solicitud, lote(codigo_seguimiento), estado_solicitud_servicio(nombre_estado)')
      .set('lote.codigo_seguimiento', `eq.${codigo}`); // Filtro por el código de seguimiento

    return this.apiService.get<SolicitudServicio>('solicitud_servicio', { params }).pipe(
      map((response: HttpResponse<SolicitudServicio>) => {
        const solicitud = response.body;
        if (!solicitud) {
          throw new Error(`No se encontró la solicitud con código de seguimiento ${codigo}.`);
        }
        return solicitud;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener solicitud con detalles esenciales
  obtenerSolicitudConDetalles(codigoSeguimiento: string): Observable<SolicitudServicio> {
    const params = new HttpParams().set(
      'select',
      `
      id_solicitud,
      id_cliente,
      id_repartidor,
      fecha_solicitud,
      observacion,
      estado_solicitud_servicio(
        nombre_estado,
        descripcion_estado
      ),
      lote!inner(
        nombre_lote,
        codigo_seguimiento,
        descripcion_lote
      ),
      repartidor(
        nombre_completo
      )
      `
    ).set('lote.codigo_seguimiento', `eq.${codigoSeguimiento}`);

    return this.apiService.get<SolicitudServicio>('solicitud_servicio', { params }).pipe(
      map((response: HttpResponse<SolicitudServicio>) => {
        const solicitud = response.body;
        if (!solicitud) {
          throw new Error(`No se encontró la solicitud con el código de seguimiento ${codigoSeguimiento}.`);
        }
        return solicitud;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener las solicitudes de servicio realizadas por un emprendedor
  obtenerSolicitudesPorEmprendedor(id_emprendedor: number): Observable<SolicitudServicio[]> {
    const params = new HttpParams().set('select', '*').set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<SolicitudServicio[]>(`${this.path}`, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  // Obtener estados de solicitud de servicio
  obtenerEstadosSolicitud(): Observable<EstadoSolicitudServicio[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<EstadoSolicitudServicio[]>(this.pathEstado, { params }).pipe(
      map((response: HttpResponse<EstadoSolicitudServicio[]>) => {
        const estados = response.body;
        if (!estados) {
          throw new Error('No se encontraron estados de solicitud de servicio.');
        }
        return estados;
      }),
      catchError(this.handleError)
    );
  }

  // Simulación para obtener emprendedor logueado
  obtenerEmprendedorLogueado(id_emprendedor: number): Observable<boolean> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<any[]>(this.path, { params }).pipe(
      map((response: HttpResponse<any[]>) => {
        const emprendedores = response.body;
        return emprendedores ? emprendedores.length > 0 : false;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener solicitudes básicas
  obtenerSolicitudesBasicas(): Observable<SolicitudServicio[]> {
    const params = new HttpParams().set('select', 'id_solicitud,id_cliente,id_repartidor,id_estado_solicitud,id_lote,fecha_solicitud,observacion');
    return this.apiService.get<SolicitudServicio[]>(this.path, { params }).pipe(
      map((response: HttpResponse<SolicitudServicio[]>) => response.body || []),
      catchError(this.handleError)
    );
  }

  // Obtener cliente por ID
  obtenerClientePorId(idCliente: number): Observable<{ nombre_completo: string }> {
    const params = new HttpParams().set('select', 'nombre_completo');
    return this.apiService.get<{ nombre_completo: string }>(`cliente?id_cliente=eq.${idCliente}`, { params }).pipe(
      map((response: HttpResponse<{ nombre_completo: string }>) => response.body || { nombre_completo: '' }),
      catchError(this.handleError)
    );
  }

  // Obtener repartidor por ID
  obtenerRepartidorPorId(idRepartidor: number): Observable<{ nombre_completo: string }> {
    const params = new HttpParams().set('select', 'nombre_completo');
    return this.apiService.get<{ nombre_completo: string }>(`repartidor?id_repartidor=eq.${idRepartidor}`, { params }).pipe(
      map((response: HttpResponse<{ nombre_completo: string }>) => response.body || { nombre_completo: '' }),
      catchError(this.handleError)
    );
  }

  // Obtener estado por ID
  obtenerEstadoPorId(idEstado: number): Observable<{ nombre_estado: string }> {
    const params = new HttpParams().set('select', 'nombre_estado');
    return this.apiService.get<{ nombre_estado: string }>(`estado_solicitud_servicio?id_estado_solicitud=eq.${idEstado}`, { params }).pipe(
      map((response: HttpResponse<{ nombre_estado: string }>) => response.body || { nombre_estado: '' }),
      catchError(this.handleError)
    );
  }

  // Obtener lote por ID
  obtenerLotePorId(idLote: number): Observable<{ nombre_lote: string; codigo_seguimiento: string }> {
    const params = new HttpParams().set('select', 'nombre_lote,codigo_seguimiento');
    return this.apiService.get<{ nombre_lote: string; codigo_seguimiento: string }>(`lote?id_lote=eq.${idLote}`, { params }).pipe(
      map((response: HttpResponse<{ nombre_lote: string; codigo_seguimiento: string }>) => response.body || { nombre_lote: '', codigo_seguimiento: '' }),
      catchError(this.handleError)
    );
  }

  // Obtener productos por ID de lote
  obtenerProductosPorLoteId(idLote: number): Observable<any[]> {
    const params = new HttpParams().set(
      'select',
      `
      cantidad,
      producto:producto(
        nombre_producto,
        precio_prod
      )
    `
    );
    return this.apiService.get<any[]>(`lote_producto?id_lote=eq.${idLote}`, { params }).pipe(
      map((response: HttpResponse<any[]>) => response.body || []),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de solicitudes de servicio'));
  }
}
