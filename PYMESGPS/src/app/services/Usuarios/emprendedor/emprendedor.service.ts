import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Emprendedor } from 'src/app/models/Usuarios/emprendedor';
import { CrearEmprendedor } from 'src/app/models/Crear/Usuarios/crearEmprendedor';
import { ActualizarEmprendedor } from 'src/app/models/Actualizar/Usuarios/actualizarEmprendedor';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmprendedorService {
  private path = 'emprendedor';

  constructor(private apiService: ApiConfigService) {}

  obtenerEmprendedorPorId(id: number): Observable<Emprendedor> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id}`);
    return this.apiService.get<Emprendedor[]>(this.path, { params }).pipe(
      map((response) => {
        const emprendedores = response.body;
        if (!emprendedores || emprendedores.length === 0) {
          throw new Error(`No se encontró el emprendedor con ID ${id}.`);
        }
        return emprendedores[0];
      }),
      catchError(this.handleError)
    );
  }

  obtenerEmprendedorPorUsername(username: string): Observable<Emprendedor[]> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<Emprendedor[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  obtenerEmprendedores(): Observable<Emprendedor[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Emprendedor[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  registrarEmprendedor(emprendedor: CrearEmprendedor): Observable<Emprendedor> {
    return this.apiService.post<Emprendedor>(this.path, emprendedor).pipe(
      map((response) => response.body as Emprendedor),
      catchError(this.handleError)
    );
  }

  actualizarEmprendedor(id: number, emprendedor: ActualizarEmprendedor): Observable<Emprendedor> {
    return this.apiService.put<Emprendedor>(`${this.path}?id_emprendedor=eq.${id}`, emprendedor).pipe(
      map((response) => response.body as Emprendedor),
      catchError(this.handleError)
    );
  }

  eliminarEmprendedor(id: number): Observable<void> {
    const data = { estado: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_emprendedor=eq.${id}`, data).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }

  actualizarImagen(idEmprendedor: number, imagenUrl: string): Observable<any> {
    const path = `emprendedor?id_emprendedor=eq.${idEmprendedor}`;
    return this.apiService.patch(path, { imagen_perfil: imagenUrl });
  }  

  esEmprendedor(id_emprendedor: number): Observable<boolean> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<Emprendedor[]>(this.path, { params }).pipe(
      map((response) => (response.body || []).length > 0),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del servicio de emprendedores'));
  }
}
