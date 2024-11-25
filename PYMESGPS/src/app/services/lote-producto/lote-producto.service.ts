// loteProducto.service.ts
import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { LoteProducto } from 'src/app/models/lote_producto';
import { catchError, map } from 'rxjs/operators';
import { LoteProductoSimplificado } from 'src/app/models/loteproductosimplificado';

@Injectable({
  providedIn: 'root'
})
export class LoteProductoService {
  private path = 'lote_producto';

  constructor(private apiService: ApiConfigService) {}

  // Obtener todos los productos de un lote
  obtenerProductosPorLote(id_lote: number): Observable<LoteProducto[]> {
    const params = new HttpParams().set('id_lote', `eq.${id_lote}`);
    return this.apiService.get<LoteProducto[]>(this.path, { params }).pipe(
      map((response: HttpResponse<LoteProducto[]>) => {
        const productos = response.body;
        if (!productos) {
          throw new Error(`No se encontraron productos para el lote con ID ${id_lote}.`);
        }
        return productos;
      }),
      catchError(this.handleError)
    );
  }

  // Agregar un producto a un lote
  agregarProductoAlLote(loteProducto: LoteProductoSimplificado): Observable<LoteProductoSimplificado> {
    return this.apiService.post<LoteProductoSimplificado>(this.path, loteProducto).pipe(
      map((response: HttpResponse<LoteProductoSimplificado>) => {
        const productoAgregado = response.body;
        if (!productoAgregado) {
          throw new Error('Error al agregar el producto al lote.');
        }
        return productoAgregado;
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar un producto de un lote
  eliminarProductoDeLote(id_lote_producto: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_lote_producto=eq.${id_lote_producto}`).pipe(
      map(() => {
        return; // Método de tipo void, no se retorna nada
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de lote-producto'));
  }
}
