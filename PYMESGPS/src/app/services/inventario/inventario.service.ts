import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Inventario } from 'src/app/models/inventario';
import { Observable, throwError } from 'rxjs';
import { CrearInventario } from 'src/app/models/Crear/crearInventario';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private path = 'inventario';
  
  constructor(private apiService: ApiConfigService) {}

  // Obtener todo el inventario
  obtenerInventario(): Observable<Inventario[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario[]>(this.path, { params }).pipe(catchError(this.handleError));
  }

  // Agregar inventario
  agregarInventario(nuevoInventario: CrearInventario): Observable<CrearInventario> {
    return this.apiService.post<CrearInventario>(this.path, nuevoInventario).pipe(
      map(response => {
        if (response && response.id_inventario) {
          return response;
        } else {
          throw new Error('No se generó id_inventario en la respuesta.');
        }
      }),
      catchError(this.handleError)
    );
  }

  // Obtener inventario por ID
  obtenerInventarioPorId(id_inventario: number): Observable<Inventario> {
    return this.apiService.get<Inventario>(`${this.path}?id_inventario=eq.${id_inventario}`).pipe(catchError(this.handleError));
  }

  // Actualizar el inventario
  actualizarInventario(id_inventario: number, inventario: Partial<Inventario>): Observable<Inventario> {
    return this.apiService.put<Inventario>(`${this.path}?id_inventario=eq.${id_inventario}`, inventario).pipe(catchError(this.handleError));
  }

  // Eliminar inventario asociado a un producto
  eliminarInventario(id_inventario: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_inventario=eq.${id_inventario}`).pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del inventario'));
  }
}
