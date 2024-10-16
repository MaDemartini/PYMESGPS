import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Lote } from 'src/app/models/lote';
import { Observable } from 'rxjs';

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
  agregarLote(lote: Lote): Observable<Lote> {
    return this.apiService.post<Lote>(this.path, lote);
  }

  // Actualizar un lote existente
  actualizarLote(id: number, lote: Partial<Lote>): Observable<Lote> {
    return this.apiService.put<Lote>(`${this.path}?id_lote=eq.${id}`, lote);
  }

  // Eliminar un lote
  eliminarLote(id: number): Observable<void> {
    const data = { estado_lote: 'cancelado' };
    return this.apiService.put<void>(`${this.path}?id_lote=eq.${id}`, data);
  }
}
