import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { HistorialEntregaRepartidor } from 'src/app/models/historial_entrega_repartidor';

@Injectable({
  providedIn: 'root',
})
export class HistorialEntregaRepartidorService {
  private path = 'historial_entrega_repartidor';

  constructor(private apiService: ApiConfigService) { }

  // Obtener historial por repartidor
  obtenerHistorialPorRepartidor(id_repartidor: number): Observable<(HistorialEntregaRepartidor & {
    solicitud: {
      cliente: { nombre_completo: string };
      lote: { nombre_lote: string };
      emprendedor: { nombre_completo: string };
      estado_solicitud: { nombre_estado: string };
    };
  })[]> {
    const params = new HttpParams().set('id_repartidor', `eq.${id_repartidor}`);
    return this.apiService
      .get<(HistorialEntregaRepartidor & {
        solicitud: {
          cliente: { nombre_completo: string };
          lote: { nombre_lote: string };
          emprendedor: { nombre_completo: string };
          estado_solicitud: { nombre_estado: string };
        };
      })[]>(
        `${this.path}?select=id_historial,id_solicitud,id_repartidor,descripcion,fecha_actualizacion,solicitud:solicitud_servicio(id_solicitud,cliente(id_cliente,nombre_completo),lote(id_lote,nombre_lote),emprendedor(id_emprendedor,nombre_completo),estado_solicitud:estado_solicitud_servicio!fk_estado_solicitud_servicio(nombre_estado))`,
        { params }
      )
      .pipe(
        map((response: any) => response.body || []),
        catchError(this.handleError)
      );
  }


  // Registrar en historial_entrega_repartidor
  agregarHistorial(historial: HistorialEntregaRepartidor): Observable<void> {
    return this.apiService
      .post<void>('historial_entrega_repartidor', historial)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('Error en HistorialEntregaRepartidorService:', error);
    return throwError(() => new Error('Error en la operación del historial de entrega del repartidor.'));
  }
}
