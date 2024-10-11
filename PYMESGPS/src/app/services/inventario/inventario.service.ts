import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Inventario } from 'src/app/models/inventario';
import { Observable } from 'rxjs';
import { CrearInventario } from 'src/app/models/Crear/crearInventario';
import { ActualizarInventario } from 'src/app/models/Actualizar/actualizarInventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private path = 'inventario';

  constructor(private apiService: ApiConfigService) { }

  // Obtener el inventario
  obtenerInventario(): Observable<Inventario[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario[]>(this.path, { params });
  }

  // Obtener un registro de inventario por ID
  obtenerInventarioPorId(id: number): Observable<Inventario> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario>(`${this.path}?id_inventario=eq.${id}`, { params });
  }

  // Agregar un nuevo registro al inventario
  agregarNuevoInventario(inventario: CrearInventario): Observable<Inventario> {
    return this.apiService.post<Inventario>(this.path, inventario);
  }

  // Actualizar un registro de inventario existente
  actualizarInventario(id: number, inventarioActualizar: ActualizarInventario): Observable<Inventario> {
    return this.apiService.put<Inventario>(`${this.path}?id_inventario=eq.${id}`, inventarioActualizar);
  }

  // Eliminar un registro de inventario
  eliminarInventario(id: number): Observable<void> {
    const data = { estado: 'eliminado' };
    return this.apiService.put<void>(`${this.path}?id_inventario=eq.${id}`, data);
  }
}
