import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { LoteProducto } from 'src/app/models/lote_producto';
import { Observable } from 'rxjs';
import { CrearLoteProducto } from 'src/app/models/Crear/crearLoteProducto';
import { ActualizarLoteProducto } from 'src/app/models/Actualizar/actualizarLoteProducto';

@Injectable({
  providedIn: 'root'
})
export class LoteProductoService {
  private path = 'lote_producto';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todas las relaciones lote-producto
  obtenerLoteProductos(): Observable<LoteProducto[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<LoteProducto[]>(this.path, { params });
  }

  // Obtener una relación lote-producto por ID
  obtenerLoteProductoPorId(id: number): Observable<LoteProducto> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<LoteProducto>(`${this.path}?id_lote_producto=eq.${id}`, { params });
  }

  // Agregar una nueva relación lote-producto
  agregarNuevoLoteProducto(loteProducto: CrearLoteProducto): Observable<LoteProducto> {
    return this.apiService.post<LoteProducto>(this.path, loteProducto);
  }

  // Actualizar una relación lote-producto existente
  actualizarLoteProducto(id: number, loteProductoActualizar: ActualizarLoteProducto): Observable<LoteProducto> {
    return this.apiService.put<LoteProducto>(`${this.path}?id_lote_producto=eq.${id}`, loteProductoActualizar);
  }

  // Eliminar una relación lote-producto
  eliminarLoteProducto(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_lote_producto=eq.${id}`);
  }
}
