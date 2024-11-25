import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Lote } from 'src/app/models/lote';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { CrearLote } from 'src/app/models/Crear/crearLote';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private path = 'lote';  // Nombre de la tabla en Supabase

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los lotes del emprendedor (GET)
  obtenerLotesPorEmprendedor(id_emprendedor: number): Observable<Lote[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<Lote[]>(this.path, { params }).pipe(
      map((response: HttpResponse<Lote[]>) => {
        const lotes = response.body;
        if (!lotes) {
          throw new Error('No se encontraron lotes para el emprendedor.');
        }
        return lotes;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener todos los lotes disponibles (GET)
  obtenerLotes(): Observable<Lote[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Lote[]>(this.path, { params }).pipe(
      map((response: HttpResponse<Lote[]>) => {
        const lotes = response.body;
        if (!lotes) {
          throw new Error('No se encontraron lotes disponibles.');
        }
        return lotes;
      }),
      catchError(this.handleError)
    );
  }

  // Crear un nuevo lote (POST)
  crearLote(nuevoLote: CrearLote): Observable<CrearLote> {
    return this.apiService.post<CrearLote[]>(this.path, nuevoLote, { observe: 'response' }).pipe(
      map((response: HttpResponse<CrearLote[]>) => {
        //console.log("Respuesta completa de crearLote:", response); // Imprimir respuesta completa para depuración
        const loteCreado = response.body && response.body.length > 0 ? response.body[0] : null;

        if (!loteCreado) {
          console.error("Error: La respuesta del servicio no contiene un lote válido.");
          throw new Error("No se generó el lote en la base de datos.");
        }

        if (!loteCreado.id_lote) {
          console.error("Error: No se generó id_lote en la respuesta del servicio.");
          throw new Error("No se generó id_lote en la respuesta.");
        }

        return loteCreado;
      }),
      catchError((error) => {
        console.error("Error en la operación de creación del lote:", error);
        return throwError(() => new Error("Error en la operación de lote"));
      })
    );
  }

  // Actualizar un lote existente (PATCH)
  actualizarLote(id_lote: number, cambios: Partial<Lote>): Observable<Lote> {
    return this.apiService.patch<Lote>(`${this.path}?id_lote=eq.${id_lote}`, cambios).pipe(
      map((response: HttpResponse<Lote>) => {
        const loteActualizado = response.body;
        if (!loteActualizado) {
          throw new Error('Error al actualizar el lote.');
        }
        return loteActualizado;
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar un lote (DELETE)
  eliminarLote(id_lote: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_lote=eq.${id_lote}`).pipe(
      map(() => {
        return; // No retornamos nada ya que es void
      }),
      catchError(this.handleError)
    );
  }

  // Obtener un lote específico por su ID (GET)
  obtenerLotePorId(id: number): Observable<Lote> {
    return this.apiService.get<Lote>(`${this.path}?id_lote=eq.${id}`).pipe(
      map((response: HttpResponse<Lote>) => {
        const lote = response.body;
        if (!lote) {
          throw new Error(`No se encontró el lote con ID ${id}.`);
        }
        return lote;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener solicitud por código de seguimiento
  obtenerSolicitudPorCodigoSeguimiento(codigoSeguimiento: string): Observable<any> {
    const params = new HttpParams()
      .set(
        'select',
        'id_lote, lote(codigo_seguimiento)' // Relación para traer el código de seguimiento desde la tabla lote
      )
      .set('lote.codigo_seguimiento', `eq.${codigoSeguimiento}`); // Filtro por el código de seguimiento en la tabla lote

    return this.apiService.get<any>('solicitud_servicio', { params }).pipe(
      map((response: HttpResponse<any>) => {
        const solicitud = response.body;
        if (!solicitud || solicitud.length === 0) {
          throw new Error(
            `No se encontró ninguna solicitud con el código de seguimiento ${codigoSeguimiento}.`
          );
        }
        return solicitud[0]; // Devolver el primer resultado si existe
      }),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación de lote'));
  }
}
