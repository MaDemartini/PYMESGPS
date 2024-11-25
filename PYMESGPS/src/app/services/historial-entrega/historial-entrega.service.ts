import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { HistorialEntrega } from 'src/app/models/historial_entrega';

@Injectable({
  providedIn: 'root',
})
export class HistorialEntregaService {
  private path = 'historial_entrega';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todo el historial de entregas
  obtenerHistorial(): Observable<HistorialEntrega[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<HistorialEntrega[]>(this.path, { params }).pipe(
      map((response: any) => response.body || []), // Extraemos el cuerpo
      catchError(this.handleError)
    );
  }

  // Registrar en historial_entrega
  agregarHistorial(historial: HistorialEntrega): Observable<void> {
    return this.apiService
      .post<void>('historial_entrega', historial)
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en HistorialEntregaService:', error);
    return throwError(() => new Error('Error en la operación del historial de entrega.'));
  }
}
