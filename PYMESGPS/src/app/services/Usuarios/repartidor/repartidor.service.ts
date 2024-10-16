import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Repartidor } from 'src/app/models/Usuarios/repartidor';
import { CrearRepartidor } from 'src/app/models/Crear/Usuarios/crearRepartidor';
import { ActualizarRepartidor } from 'src/app/models/Actualizar/Usuarios/actualizarRepartidor';
import { CrearRepartidorSolicitud } from 'src/app/models/Crear/Usuarios/crearRepartidorSolicitud';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {
  private path = 'repartidor';

  constructor(private apiService: ApiConfigService) {}

  // Obtener un repartidor por ID usando HttpParams
  obtenerRepartidorPorId(id: number): Observable<Repartidor> {
    const params = new HttpParams().set('id_repartidor', `eq.${id}`);
    return this.apiService.get<Repartidor>(this.path, { params });
  }

  obtenerRepartidorPorUsername(username: string): Observable<any> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<any>(`repartidor`, { params });
  }

  // Obtener todos los repartidores
  obtenerRepartidores(): Observable<Repartidor[]> {
    return this.apiService.get<Repartidor[]>(this.path);
  }

  // Registrar un nuevo repartidor
  registrarRepartidor(repartidor: CrearRepartidor): Observable<any> {
    return this.apiService.post(this.path, repartidor);
  }

  // Actualizar un repartidor existente usando HttpParams
  actualizarRepartidor(id: number, repartidor: ActualizarRepartidor): Observable<any> {
    const params = new HttpParams().set('id_repartidor', `eq.${id}`);
    return this.apiService.put(`${this.path}?id_repartidor=eq.${id}`, repartidor);  
  }

  // Eliminar un repartidor usando HttpParams (soft delete cambiando el estado)
  eliminarRepartidor(id: number): Observable<void> {
    const data = { estado: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_repartidor=eq.${id}`, data);  
  }

  solicitarRepartidor(nuevoRepartidor: CrearRepartidorSolicitud): Observable<any> {
    return this.apiService.post('solicitud-repartidor', nuevoRepartidor);
  }  


  // Verificar si es repartidor usando HttpParams
  esRepartidor(id_repartidor: number): Observable<boolean> {
    const params = new HttpParams().set('id_repartidor', `eq.${id_repartidor}`);
    return this.apiService.get<any[]>(this.path, { params })
      .pipe(map((repartidores: any[]) => repartidores.length > 0));
  }
}
