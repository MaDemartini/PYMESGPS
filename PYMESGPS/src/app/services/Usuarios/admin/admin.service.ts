import { Injectable } from '@angular/core';
import { Admin } from 'src/app/models/Usuarios/admin';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private path = 'admin';

  constructor(private apiService: ApiConfigService) {}

  // Obtener un admin por ID usando HttpParams
  obtenerAdminPorId(id: number): Observable<Admin> {
    const params = new HttpParams().set('id_admin', `eq.${id}`);
    return this.apiService.get<Admin[]>(this.path, { params })
      .pipe(
        map((admin: Admin[]) => admin[0])
      );
  }

  // Obtener un admin por su username
  obtenerAdminPorUsername(username: string): Observable<Admin[]> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<Admin[]>(`${this.path}`, { params });
  }

  //Registrar un nuevo admin
  //registrarAdmin(admin: CrearAdmin): Observable<any> {
  //  return this.apiService.post(this.path, admin);
  //}

  // Verificar si es Admin
  esAdmin(id_admin: number): Observable<boolean> {
    const params = new HttpParams().set('id_admin', `eq.${id_admin}`);
    return this.apiService.get<Admin[]>(`${this.path}`, { params })
      .pipe(map((admins: Admin[]) => admins.length > 0));
  }

}
