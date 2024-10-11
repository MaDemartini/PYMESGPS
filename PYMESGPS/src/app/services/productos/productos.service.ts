import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Producto } from 'src/app/models/producto';
import { Observable } from 'rxjs';
import { ActualizarProducto } from 'src/app/models/Actualizar/actualizarProducto';
import { CrearProducto } from 'src/app/models/Crear/crearProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private path = 'producto';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los productos con estado activo
  obtenerProductos(): Observable<Producto[]> {
    const params = new HttpParams().set('select', '*').set('estado_prod', 'eq.activo');
    return this.apiService.get<Producto[]>(this.path, { params });
  }

  // Obtener un producto por ID
  obtenerProductoPorId(id: number): Observable<Producto> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Producto>(`${this.path}?id_producto=eq.${id}`, { params });
  }

  // Agregar un nuevo producto con estado activo
  agregarNuevoProducto(producto: CrearProducto): Observable<Producto> {
    producto.estado_prod = 'activo';  // Estado inicial por defecto
    return this.apiService.post<Producto>(this.path, producto);
  }

  // Actualizar un producto existente
  actualizarProducto(id: number, productoActualizar: ActualizarProducto): Observable<Producto> {
    return this.apiService.put<Producto>(`${this.path}?id_producto=eq.${id}`, productoActualizar);
  }

  // Cambiar el estado de un producto (por ejemplo, a 'eliminado' o 'sin stock')
  cambiarEstadoProducto(id: number, nuevoEstado: string): Observable<Producto> {
    const data = { estado_prod: nuevoEstado };
    return this.apiService.put<Producto>(`${this.path}?id_producto=eq.${id}`, data);
  }

  // Eliminar un producto (cambiar su estado a "eliminado")
  eliminarProducto(id: number): Observable<void> {
    const data = { estado_prod: 'eliminado' };
    return this.apiService.put<void>(`${this.path}?id_producto=eq.${id}`, data);
  }
}
