import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Lote } from 'src/app/models/lote';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private path = 'lote';  // Nombre de la tabla en Supabase

  constructor(private apiService: ApiConfigService) {}

  // Obtener todos los lotes del emprendedor (GET)
  obtenerLotesPorEmprendedor(id_emprendedor: number): Observable<Lote[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<Lote[]>(this.path, { params });
  }

  // Obtener todos los lotes disponibles (GET)
  obtenerLotes(): Observable<Lote[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Lote[]>(this.path, { params });
  }

  // Crear un nuevo lote (POST)
  crearLote(nuevoLote: Lote): Observable<Lote> {
    return this.apiService.post<Lote>(this.path, nuevoLote).pipe(
      map(response => {
        if (response && response.id_lote) {
          return response;
        } else {
          throw new Error('Error al crear el lote');
        }
      })
    );
  }

  // Actualizar un lote existente (PATCH)
  actualizarLote(id_lote: number, cambios: Partial<Lote>): Observable<Lote> {
    return this.apiService.patch<Lote>(`${this.path}?id_lote=eq.${id_lote}`, cambios);
  }

  // Eliminar un lote (DELETE)
  eliminarLote(id_lote: number): Observable<any> {
    return this.apiService.delete(`${this.path}?id_lote=eq.${id_lote}`);
  }

  // Obtener un lote específico por su ID (GET)
  obtenerLotePorId(id: number): Observable<Lote> {
    return this.apiService.get<Lote>(`${this.path}?id_lote=eq.${id}`).pipe(catchError(this.handleError));
  }

  // Obtener lote por código de seguimiento
  async obtenerSolicitudPorCodigoSeguimiento(codigoSeguimiento: string) {
    const params = new HttpParams()
      .set('select', '*, lote(codigo_seguimiento)')
      .set('codigo_seguimiento', `eq.${codigoSeguimiento}`);
    
    return this.apiService.get<any>(`solicitud_servicio`, { params }).pipe(catchError(this.handleError));
  }
  

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del inventario'));
  }
}
