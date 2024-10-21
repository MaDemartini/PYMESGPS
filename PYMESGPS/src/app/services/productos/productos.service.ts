import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Producto } from 'src/app/models/producto';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrearProducto } from 'src/app/models/Crear/crearProducto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private path = 'producto';

  constructor(private apiService: ApiConfigService, private http: HttpClient) {}

  
  // Obtener productos por emprendedor en sesión
  obtenerProductosPorEmprendedor(id_emprendedor: number): Observable<Producto[]> {
    const params = new HttpParams().set('select', '*, inventario(*)')
                                   .set('id_emprendedor', `eq.${id_emprendedor}`); // Filtrar por emprendedor
    return this.apiService.get<Producto[]>(this.path, { params });
  }

  // Obtener un producto por ID con inventario
  obtenerProductoPorId(id: number): Observable<Producto> {
    const params = new HttpParams().set('select', '*, inventario(*)');
    return this.apiService.get<Producto>(`${this.path}?id_producto=eq.${id}`, { params });
  }

  agregarProducto(nuevoProducto: CrearProducto): Observable<CrearProducto> {
    return this.apiService.post<CrearProducto>('producto', nuevoProducto).pipe(
      map(response => {
        if (response && response.id_producto) {
          return response;
        } else {
          throw new Error('No se generó id_inventario en la respuesta.');
        }
      })
    );
  }

  // Método para agregar un producto con inventario
  agregarProductoConInventario(producto: CrearProducto): Observable<CrearProducto> {
    return this.apiService.post<CrearProducto>(this.path, producto).pipe(
      map((response: any) => {
        if (response && response.id_producto) {
          return response;
        } else {
          throw new Error('No se generó id_producto en la respuesta.');
        }
      })
    );
  }

  // Actualizar el producto con id_inventario
  actualizarProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.path}?id_producto=eq.${id}`, producto);
  }

  // Eliminar un producto (soft delete)
  eliminarProducto(id: number): Observable<void> {
    const data = { estado_prod: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_producto=eq.${id}`, data);
  }

  // Obtener productos con inventario relacionado
  obtenerProductosConInventario(): Observable<Producto[]> {
    const params = new HttpParams().set(
      'select',
      '*, inventario(cantidad_disponible, umbral_reabastecimiento, fecha_actualizacion)'
    );
    return this.apiService.get<Producto[]>(this.path, { params });
  }
  
}
