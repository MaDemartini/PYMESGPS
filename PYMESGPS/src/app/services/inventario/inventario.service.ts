import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Inventario } from 'src/app/models/inventario';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CrearInventario } from 'src/app/models/Crear/crearInventario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private path = 'inventario';
  
  constructor(private apiService: ApiConfigService, private http: HttpClient) {}

  // Obtener todo el inventario
  obtenerInventario(): Observable<Inventario[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Inventario[]>(this.path, { params });
  }

  // Método POST para agregar inventario
  agregarInventario(nuevoInventario: CrearInventario): Observable<CrearInventario> {
    return this.apiService.post<CrearInventario>('inventario', nuevoInventario).pipe(
      map(response => {
        if (response && response.id_inventario) {
          return response;
        } else {
          throw new Error('No se generó id_inventario en la respuesta.');
        }
      })
    );
  }

 
  // Obtener inventario por ID
  obtenerInventarioPorId(id_inventario: number): Observable<Inventario> {
    return this.apiService.get<Inventario>(`${this.path}?id_inventario=eq.${id_inventario}`);
  }

  // Actualizar el inventario
  actualizarInventario(id_inventario: number, inventario: Partial<Inventario>): Observable<Inventario> {
    return this.apiService.put<Inventario>(`${this.path}?id_inventario=eq.${id_inventario}`, inventario);
  }

  // Eliminar inventario asociado a un producto
  eliminarInventario(id_inventario: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_inventario=eq.${id_inventario}`);
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del inventario'));
  }


}


