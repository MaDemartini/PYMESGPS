import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Admin } from 'src/app/models/Usuarios/admin';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private path = 'admin';

  constructor(private apiService: ApiConfigService) {}

  // Obtener un administrador por ID
  obtenerAdminPorId(id: number): Observable<Admin> {
    const params = new HttpParams().set('id_admin', `eq.${id}`);
    return this.apiService.get<Admin[]>(this.path, { params }).pipe(
      map((response) => {
        const admins = response.body;
        if (!admins || admins.length === 0) {
          throw new Error(`No se encontró el administrador con ID ${id}.`);
        }
        return admins[0];
      }),
      catchError(this.handleError)
    );
  }

  // Obtener administradores por nombre de usuario
  obtenerAdminPorUsername(username: string): Observable<Admin[]> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<Admin[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  actualizarImagen(idAdmin: number, imagenUrl: string): Observable<any> {
    const path = `admin?id_admin=eq.${idAdmin}`;
    return this.apiService.patch(path, { imagen_perfil: imagenUrl });
  }  

  // Verificar si el usuario es un administrador
  esAdmin(id_admin: number): Observable<boolean> {
    const params = new HttpParams().set('id_admin', `eq.${id_admin}`);
    return this.apiService.get<Admin[]>(this.path, { params }).pipe(
      map((response) => (response.body || []).length > 0),
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error en AdminService:', error);
    return throwError(() => new Error('Error en la operación del servicio de administradores'));
  }
}
