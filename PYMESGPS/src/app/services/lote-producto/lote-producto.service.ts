import { Injectable } from '@angular/core';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { LoteProducto } from 'src/app/models/lote_producto';

@Injectable({
  providedIn: 'root'
})
export class LoteProductoService {

  private path = 'lote_producto';

  constructor(private apiService: ApiConfigService) { }

  // Obtener la relación lote-producto por id_lote
  obtenerProductosPorLote(id_lote: number): Observable<LoteProducto[]> {
    const params = new HttpParams().set('id_lote', `eq.${id_lote}`);
    return this.apiService.get<LoteProducto[]>(`${this.path}`, { params });
  }

  // Agregar un producto a un lote
  agregarProductoALote(loteProducto: LoteProducto): Observable<any> {
    return this.apiService.post(this.path, loteProducto);
  }

  // Actualizar la cantidad de un producto en un lote
  actualizarCantidadProducto(loteProducto: Partial<LoteProducto>, id_lote: number, id_producto: number): Observable<any> {
    return this.apiService.put(`${this.path}?id_lote=eq.${id_lote}&id_producto=eq.${id_producto}`, loteProducto);
  }

  // Eliminar un producto de un lote
  eliminarProductoDeLote(id_lote: number, id_producto: number): Observable<any> {
    return this.apiService.delete(`${this.path}?id_lote=eq.${id_lote}&id_producto=eq.${id_producto}`);
  }
}
