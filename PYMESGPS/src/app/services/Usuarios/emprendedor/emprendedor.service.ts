import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Emprendedor } from 'src/app/models/Usuarios/emprendedor';
import { CrearEmprendedor } from 'src/app/models/Crear/Usuarios/crearEmprendedor';
import { ActualizarEmprendedor } from 'src/app/models/Actualizar/Usuarios/actualizarEmprendedor';

@Injectable({
  providedIn: 'root'
})
export class EmprendedorService {
  private path = 'emprendedor';

  constructor(private apiService: ApiConfigService) {}

  // Obtener un emprendedor por ID usando HttpParams
  obtenerEmprendedorPorId(id: number): Observable<Emprendedor> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id}`);
    return this.apiService.get<Emprendedor>(this.path, { params });
  }

  obtenerEmprendedorPorUsername(username: string): Observable<any> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<any>(`emprendedor`, { params });
  }  

  // Obtener todos los emprendedores
  obtenerEmprendedores(): Observable<Emprendedor[]> {
    return this.apiService.get<Emprendedor[]>(this.path);
  }

  // Registrar un nuevo emprendedor
  registrarEmprendedor(emprendedor: CrearEmprendedor): Observable<any> {
    return this.apiService.post(this.path, emprendedor);
  }

  // Actualizar un emprendedor existente usando HttpParams
  actualizarEmprendedor(id: number, emprendedor: ActualizarEmprendedor): Observable<any> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id}`);
    return this.apiService.put(`${this.path}?id_emprendedor=eq.${id}`, emprendedor);  
  }

  // Eliminar un emprendedor usando HttpParams (soft delete cambiando el estado)
  eliminarEmprendedor(id: number): Observable<void> {
    const data = { estado: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_emprendedor=eq.${id}`, data);  
  }

  // Verificar si es emprendedor usando HttpParams
  esEmprendedor(id_emprendedor: number): Observable<boolean> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<any[]>(this.path, { params })
      .pipe(map((emprendedores: any[]) => emprendedores.length > 0));
  }
}
