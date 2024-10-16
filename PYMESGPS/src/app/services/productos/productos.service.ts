import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Producto } from 'src/app/models/producto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private path = 'producto';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Producto[]>(this.path, { params });
  }

  // Obtener un producto por ID
  obtenerProductoPorId(id: number): Observable<Producto> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Producto>(`${this.path}?id_producto=eq.${id}`, { params });
  }

  // Agregar un nuevo producto
  agregarProducto(producto: Producto): Observable<Producto> {
    return this.apiService.post<Producto>(this.path, producto);
  }

  // Actualizar un producto existente
  actualizarProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.apiService.put<Producto>(`${this.path}?id_producto=eq.${id}`, producto);
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<void> {
    const data = { estado_prod: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_producto=eq.${id}`, data);
  }
}
