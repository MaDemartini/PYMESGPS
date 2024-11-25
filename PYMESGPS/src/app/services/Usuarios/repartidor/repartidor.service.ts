import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Repartidor } from 'src/app/models/Usuarios/repartidor';
import { CrearRepartidor } from 'src/app/models/Crear/Usuarios/crearRepartidor';
import { ActualizarRepartidor } from 'src/app/models/Actualizar/Usuarios/actualizarRepartidor';
import { CrearRepartidorSolicitud } from 'src/app/models/Crear/Usuarios/crearRepartidorSolicitud';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {
  private path = 'repartidor';

  constructor(private apiService: ApiConfigService) { }

  obtenerRepartidorPorId(id: number): Observable<Repartidor> {
    const params = new HttpParams().set('id_repartidor', `eq.${id}`);
    return this.apiService.get<Repartidor[]>(this.path, { params }).pipe(
      map((response) => {
        const repartidores = response.body;
        if (!repartidores || repartidores.length === 0) {
          throw new Error(`No se encontró el repartidor con ID ${id}.`);
        }
        return repartidores[0];
      }),
      catchError(this.handleError)
    );
  }

  obtenerRepartidorPorUsername(username: string): Observable<Repartidor[]> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<Repartidor[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  obtenerRepartidoresPorEmprendedor(id_emprendedor: number): Observable<Repartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<Repartidor[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  obtenerRepartidores(): Observable<Repartidor[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Repartidor[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  registrarRepartidor(repartidor: CrearRepartidor): Observable<Repartidor> {
    return this.apiService.post<Repartidor>(this.path, repartidor).pipe(
      map((response) => response.body as Repartidor),
      catchError(this.handleError)
    );
  }

  actualizarRepartidor(id: number, repartidor: ActualizarRepartidor): Observable<Repartidor> {
    return this.apiService.put<Repartidor>(`${this.path}?id_repartidor=eq.${id}`, repartidor).pipe(
      map((response) => response.body as Repartidor),
      catchError(this.handleError)
    );
  }

  eliminarRepartidor(id: number): Observable<void> {
    const data = { estado: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_repartidor=eq.${id}`, data).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  solicitarRepartidor(nuevoRepartidor: CrearRepartidorSolicitud): Observable<CrearRepartidorSolicitud> {
    return this.apiService.post<CrearRepartidorSolicitud>('solicitud-repartidor', nuevoRepartidor).pipe(
      map((response) => response.body as CrearRepartidorSolicitud),
      catchError(this.handleError)
    );
  }

  actualizarImagen(idRepartidor: number, imagenUrl: string): Observable<any> {
    const path = `repartidor?id_repartidor=eq.${idRepartidor}`;
    return this.apiService.patch(path, { imagen_perfil: imagenUrl });
  }  

  esRepartidor(id_repartidor: number): Observable<boolean> {
    const params = new HttpParams().set('id_repartidor', `eq.${id_repartidor}`);
    return this.apiService.get<Repartidor[]>(this.path, { params }).pipe(
      map((response) => (response.body || []).length > 0),
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del servicio de repartidores'));
  }
}
