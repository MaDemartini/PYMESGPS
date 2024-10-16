import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Inventario } from 'src/app/models/inventario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private path = 'inventario';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todo el inventario
  obtenerInventario(): Observable<Inventario[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario[]>(this.path, { params });
  }

  // Obtener un inventario por ID de producto
  obtenerInventarioPorProducto(id_producto: number): Observable<Inventario> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario>(`${this.path}?id_producto=eq.${id_producto}`, { params });
  }

  // Actualizar el inventario de un producto
  actualizarInventario(id_producto: number, cantidad: number): Observable<Inventario> {
    return this.apiService.put<Inventario>(`${this.path}?id_producto=eq.${id_producto}`, { cantidad_disponible: cantidad });
  }
}
