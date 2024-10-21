import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearSolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/crearSolicitud-repartidor';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { SolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/solicitud-repartidor';

@Injectable({
  providedIn: 'root'
})
export class SolicitudRepartidorService {
  private path = 'solicitud_repartidor';  

  constructor(private apiService: ApiConfigService) {}

  obtenerSolicitudesEmprendedor(id_emprendedor: number): Observable<SolicitudRepartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`);
    return this.apiService.get<SolicitudRepartidor[]>(`${this.path}?select=*,estado_solicitud_repartidor(nombre_estado)`, { params });
  }

  obtenerSolicitudesAprobadas(id_emprendedor: number): Observable<SolicitudRepartidor[]> {
    const params = new HttpParams().set('id_emprendedor', `eq.${id_emprendedor}`).set('id_estado_solicitud', 'eq.2'); 
    return this.apiService.get<SolicitudRepartidor[]>(`solicitud_repartidor`, { params });
  }

  marcarComoRegistrado(id_solicitud: number): Observable<void> {
    return this.apiService.patch(`solicitud_repartidor?id_solicitud=eq.${id_solicitud}`, { registrado: true });
  }  

  // Crear una nueva solicitud de repartidor (Emprendedor)
  crearSolicitudRepartidor(solicitud: CrearSolicitudRepartidor): Observable<CrearSolicitudRepartidor> {
    return this.apiService.post<CrearSolicitudRepartidor>(this.path, solicitud);
  }
}
