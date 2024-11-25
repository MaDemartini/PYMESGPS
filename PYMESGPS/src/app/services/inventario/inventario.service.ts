import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Inventario } from 'src/app/models/inventario';
import { Observable, throwError } from 'rxjs';
import { CrearInventario } from 'src/app/models/Crear/crearInventario';
import { catchError, map } from 'rxjs/operators';
import { ActualizarInventario } from 'src/app/models/Actualizar/actualizarInventario';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private path = 'inventario';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todo el inventario
  obtenerInventario(): Observable<Inventario[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario[]>(this.path, { params }).pipe(
      map((response: HttpResponse<Inventario[]>) => {
        const inventario = response.body;
        if (!inventario) {
          throw new Error('No se encontró el inventario en la respuesta.');
        }
        return inventario;
      }),
      catchError(this.handleError)
    );
  }

  // Agregar inventario
  agregarInventario(nuevoInventario: CrearInventario): Observable<CrearInventario> {
    return this.apiService.post<CrearInventario>(this.path, nuevoInventario, { observe: 'response' }).pipe(
      map((response: HttpResponse<CrearInventario>) => {
        // console.log("Respuesta completa del servidor en agregarInventario:", response); 
        const inventario = response.body;
        if (!inventario || inventario.id_inventario) {
          console.error('Error: No se generó id_inventario en la respuesta del servicio.');
          throw new Error('No se generó id_inventario en la respuesta.');
        }
        return inventario;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener inventario por ID
  obtenerInventarioPorId(id_inventario: number): Observable<Inventario> {
    const params = new HttpParams().set('id_inventario', `eq.${id_inventario}`);
    return this.apiService.get<Inventario>(`${this.path}`, { params }).pipe(
      map((response: HttpResponse<Inventario>) => {
        const inventario = response.body;
        if (!inventario) {
          throw new Error(`No se encontró el inventario con ID ${id_inventario} en la respuesta.`);
        }
        return inventario;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar el inventario
  actualizarInventario(id_inventario: number, inventario: Partial<ActualizarInventario>): Observable<void> {
    return this.apiService.patch<ActualizarInventario>(`${this.path}?id_inventario=eq.${id_inventario}`, inventario).pipe(
      map(() => {
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar inventario asociado a un producto
  eliminarInventario(id_inventario: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_inventario=eq.${id_inventario}`).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en InventarioService:', error);
    return throwError(() => new Error('Error en la operación del inventario'));
  }
}
