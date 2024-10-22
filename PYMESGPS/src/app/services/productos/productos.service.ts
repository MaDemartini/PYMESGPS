import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Producto } from 'src/app/models/producto';
import { Observable, throwError } from 'rxjs';
import { CrearProducto } from 'src/app/models/Crear/crearProducto';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private path = 'producto';

  constructor(private apiService: ApiConfigService) {}

  // Obtener productos por emprendedor en sesión
  obtenerProductosPorEmprendedor(id_emprendedor: number): Observable<Producto[]> {
    const params = new HttpParams()
      .set('select', '*, inventario(*)')
      .set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<Producto[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Obtener todos los productos
  obtenerTodosLosProductos(): Observable<Producto[]> {
    const params = new HttpParams().set('select', '*, inventario(*)');
    return this.apiService.get<Producto[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Obtener un producto por ID con inventario
  obtenerProductoPorId(id: number): Observable<Producto> {
    const params = new HttpParams().set('select', '*, inventario(*)');
    return this.apiService.get<Producto>(`${this.path}?id_producto=eq.${id}`, { params }).pipe(catchError(this.handleError));
  }

  // Agregar un nuevo producto
  agregarProducto(nuevoProducto: CrearProducto): Observable<CrearProducto> {
    return this.apiService.post<CrearProducto>(this.path, nuevoProducto).pipe(
      map((response: CrearProducto) => {
        if (response && response.id_producto) {
          return response;
        } else {
          throw new Error('No se generó id_producto en la respuesta.');
        }
      }),
      catchError(this.handleError)
    );
  }
  
  
  // Actualizar el producto
  actualizarProducto(id_producto: number, producto: Partial<Producto>): Observable<Producto> {
    return this.apiService.patch<Producto>(`${this.path}?id_producto=eq.${id_producto}`, producto).pipe(catchError(this.handleError));
  }
  
  
  // Método para actualizar el inventario de un producto
  actualizarInventario(id_producto: number, data: Partial<{ cantidad_disponible: number }>): Observable<any> {
    return this.apiService.patch(`inventario?id_producto=eq.${id_producto}`, data).pipe(catchError(this.handleError));
  }

  eliminarProducto(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_producto=eq.${id}`).pipe(catchError(this.handleError));
  }
  
  
  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de productos'));
  }
}
