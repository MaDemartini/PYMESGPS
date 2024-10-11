import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Lote } from 'src/app/models/lote';
import { Observable } from 'rxjs';
import { CrearLote } from 'src/app/models/Crear/crearLote';
import { ActualizarLote } from 'src/app/models/Actualizar/actualizarLote';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private path = 'lote';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los lotes
  obtenerLotes(): Observable<Lote[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Lote[]>(this.path, { params });
  }

  // Obtener un lote por ID
  obtenerLotePorId(id: number): Observable<Lote> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Lote>(`${this.path}?id_lote=eq.${id}`, { params });
  }

  // Agregar un nuevo lote
  agregarNuevoLote(lote: CrearLote): Observable<Lote> {
    return this.apiService.post<Lote>(this.path, lote);
  }

  // Actualizar un lote existente
  actualizarLote(id: number, loteActualizar: ActualizarLote): Observable<Lote> {
    return this.apiService.put<Lote>(`${this.path}?id_lote=eq.${id}`, loteActualizar);
  }

  // Cambiar el estado de un lote (por ejemplo, a "entregado", "en tránsito", etc.)
  cambiarEstadoLote(id: number, nuevoEstado: string): Observable<Lote> {
    const data = { estado_lote: nuevoEstado };
    return this.apiService.put<Lote>(`${this.path}?id_lote=eq.${id}`, data);
  }

  // Eliminar un lote (cambiar su estado a "cancelado" o "eliminado")
  eliminarLote(id: number): Observable<void> {
    const data = { estado_lote: 'eliminado' };
    return this.apiService.put<void>(`${this.path}?id_lote=eq.${id}`, data);
  }
}
