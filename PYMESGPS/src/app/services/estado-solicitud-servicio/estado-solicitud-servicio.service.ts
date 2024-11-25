import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { EstadoSolicitudServicio } from 'src/app/models/estado_solicitud_servicio';
import { ActualizarSolicitudServicio } from 'src/app/models/Actualizar/actualizarSolicitudServicio';

@Injectable({
  providedIn: 'root'
})
export class EstadoSolicitudServicioService {
  private path = 'estado_solicitud_servicio';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los estados de solicitud
  obtenerEstadosSolicitud(): Observable<EstadoSolicitudServicio[]> {
    return this.apiService.get<EstadoSolicitudServicio[]>(this.path).pipe(
      map((response: HttpResponse<EstadoSolicitudServicio[]>) => {
        const estados = response.body;
        if (!estados) {
          throw new Error('No se encontraron estados de solicitud.');
        }
        return estados;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener un estado de solicitud por ID
  obtenerEstadoSolicitudPorId(idEstado: number): Observable<EstadoSolicitudServicio> {
    const params = new HttpParams().set('id_estado_solicitud', `eq.${idEstado}`);
    return this.apiService.get<EstadoSolicitudServicio[]>(this.path, { params }).pipe(
      map((response: HttpResponse<EstadoSolicitudServicio[]>) => {
        const estados = response.body;
        if (!estados || estados.length === 0) {
          throw new Error(`No se encontró el estado con ID ${idEstado}.`);
        }
        return estados[0]; // Retorna el primer elemento del array
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar un estado de solicitud en la tabla solicitud_servicio
  actualizarEstadoSolicitud(id_solicitud: number, datosActualizar: ActualizarSolicitudServicio): Observable<void> {
    return this.apiService
      .patch<void>(
        `solicitud_servicio?id_solicitud=eq.${id_solicitud}`,
        datosActualizar 
      )
      .pipe(
        map(() => void 0), // Mapeo para retornar void
        catchError(this.handleError) 
      );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Error en EstadoSolicitudServicioService:', error);
    throw error;
  }
}
