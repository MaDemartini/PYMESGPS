import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Producto } from 'src/app/models/producto';
import { Observable, throwError } from 'rxjs';
import { CrearProducto } from 'src/app/models/Crear/crearProducto';
import { catchError, map } from 'rxjs/operators';
import { ActualizarProducto } from 'src/app/models/Actualizar/actualizarProducto';
import { LoteProducto } from 'src/app/models/lote_producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private path = 'producto';

  constructor(private apiService: ApiConfigService) { }

  // Obtener productos por emprendedor en sesión
  obtenerProductosPorEmprendedor(id_emprendedor: number): Observable<Producto[]> {
    const params = new HttpParams()
      .set('select', '*, inventario(*)')
      .set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<Producto[]>(this.path, { params }).pipe(
      map((response) => {
        const productos = response.body;
        if (!productos) {
          throw new Error(`No se encontraron productos para el emprendedor con ID ${id_emprendedor}.`);
        }
        return productos;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener todos los productos
  obtenerTodosLosProductos(): Observable<Producto[]> {
    const params = new HttpParams().set('select', '*, inventario(*)');
    return this.apiService.get<Producto[]>(this.path, { params }).pipe(
      map((response) => {
        const productos = response.body;
        if (!productos) {
          throw new Error('No se encontraron productos.');
        }
        return productos;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener un producto por ID con inventario
  obtenerProductoPorId(id: number): Observable<Producto> {
    const params = new HttpParams().set('select', '*, inventario(*)');
    return this.apiService.get<Producto[]>(`${this.path}?id_producto=eq.${id}`, { params }).pipe(
      map((response) => {
        const productos = response.body;
        if (!productos || productos.length === 0) {
          throw new Error(`No se encontró el producto con ID ${id}.`);
        }
        return productos[0]; // Retornar solo el primer elemento (producto) del array
      }),
      catchError(this.handleError)
    );
  }

  obtenerProductosPorLote(idLote: number): Observable<LoteProducto[]> {
    const params = new HttpParams().set('id_lote', `eq.${idLote}`);
    return this.apiService.get<LoteProducto[]>(`lote_producto`, { params }).pipe(
      map((response: HttpResponse<LoteProducto[]>) => {
        const loteProductos = response.body;
        if (!loteProductos) {
          throw new Error(`No se encontraron productos para el lote con ID ${idLote}.`);
        }
        return loteProductos;
      }),
      catchError((error) => {
        console.error('Error al obtener productos por lote:', error);
        return throwError(() => new Error('Error al obtener productos por lote.'));
      })
    );
  }

  // Agregar un nuevo producto
  agregarProducto(nuevoProducto: CrearProducto): Observable<CrearProducto> {
    return this.apiService.post<CrearProducto>(this.path, nuevoProducto, { observe: 'response' }).pipe(
      map((response: HttpResponse<CrearProducto>) => {
        // console.log("Respuesta completa de agregarProducto:", response); // Log de la respuesta completa
        const productoCreado = response.body;
        if (!productoCreado || productoCreado.id_producto) {
          console.error("Error: No se generó id_producto en la respuesta del servicio.");
          throw new Error("No se generó id_producto en la respuesta.");
        }
        return productoCreado;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar el producto
  actualizarProducto(id_producto: number, producto: Partial<ActualizarProducto>): Observable<void> {
    return this.apiService.patch<ActualizarProducto>(`${this.path}?id_producto=eq.${id_producto}`, producto).pipe(
      map(() => {
        console.log('Producto actualizado correctamente en la base de datos.');
      }),
      catchError(this.handleError)
    );
  }

  // Método para actualizar el estado del producto
  actualizarEstadoProducto(id_producto: number, estado: boolean): Observable<any> {
    return this.apiService.patch(`${this.path}?id_producto=eq.${id_producto}`, { estado_prod: estado }).pipe(
      map((response) => {
        if (!response.body) {
          throw new Error(`No se pudo actualizar el estado del producto con ID ${id_producto}.`);
        }
        return response.body;
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar producto
  eliminarProducto(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_producto=eq.${id}`).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en ProductoService:', error);
    return throwError(() => new Error('Error en la operación de productos'));
  }
}
