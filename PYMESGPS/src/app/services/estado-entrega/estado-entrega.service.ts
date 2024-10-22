import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { EstadoEntrega } from 'src/app/models/estado_entrega';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoEntregaService {
  private path = 'estado_entrega';

  constructor(private apiService: ApiConfigService) {}

  // Obtener todos los estados de entrega
  obtenerEstados(): Observable<EstadoEntrega[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<EstadoEntrega[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Obtener un estado de entrega por ID
  obtenerEstadoPorId(id: number): Observable<EstadoEntrega> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<EstadoEntrega>(`${this.path}?id_estado=eq.${id}`, { params }).pipe(catchError(this.handleError));
  }

  // Cambiar el estado de una entrega
  actualizarEstado(id: number, estadoActualizar: Partial<EstadoEntrega>): Observable<EstadoEntrega> {
    return this.apiService.put<EstadoEntrega>(`${this.path}?id_estado=eq.${id}`, estadoActualizar).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de estado de entrega'));
  }
}
