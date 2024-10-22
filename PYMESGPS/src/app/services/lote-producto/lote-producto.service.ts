import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { LoteProducto } from 'src/app/models/lote_producto'; // Asegúrate de tener el modelo correcto
import { catchError } from 'rxjs/operators';
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
    return this.apiService.get<LoteProducto[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Agregar un producto a un lote
  agregarProductoAlLote(loteProducto: LoteProductoSimplificado): Observable<LoteProductoSimplificado> {
    return this.apiService.post<LoteProductoSimplificado>(this.path, loteProducto).pipe(catchError(this.handleError));
  }

  // Eliminar un producto de un lote
  eliminarProductoDeLote(id_lote_producto: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_lote_producto=eq.${id_lote_producto}`).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de lote-producto'));
  }
}
