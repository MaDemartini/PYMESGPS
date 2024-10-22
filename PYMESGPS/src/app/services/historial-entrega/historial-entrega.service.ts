import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { HistorialEntrega } from 'src/app/models/historial_entrega';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialEntregaService {
  private path = 'historial_entrega';

  constructor(private apiService: ApiConfigService) {}

  // Obtener todo el historial de entregas
  obtenerHistorial(): Observable<HistorialEntrega[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<HistorialEntrega[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Obtener historial de entregas por ID de lote
  obtenerHistorialPorLote(id_lote: number): Observable<HistorialEntrega[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<HistorialEntrega[]>(`${this.path}?id_lote=eq.${id_lote}`, { params }).pipe(catchError(this.handleError));
  }

  // Agregar un registro al historial de entrega
  agregarHistorial(historial: HistorialEntrega): Observable<HistorialEntrega> {
    return this.apiService.post<HistorialEntrega>(this.path, historial).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del historial de entrega'));
  }
}
