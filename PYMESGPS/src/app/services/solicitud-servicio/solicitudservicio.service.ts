import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudServicioService {
  private path = 'solicitud_servicio';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todas las solicitudes de servicio
  obtenerSolicitudes(): Observable<SolicitudServicio[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio[]>(this.path, { params });
  }

  // Obtener una solicitud de servicio por ID
  obtenerSolicitudPorId(id: number): Observable<SolicitudServicio> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, { params });
  }

  // Crear una nueva solicitud de servicio
  agregarSolicitudServicio(solicitud: SolicitudServicio): Observable<SolicitudServicio> {
    return this.apiService.post<SolicitudServicio>(this.path, solicitud);
  }

  // Actualizar una solicitud de servicio existente
  actualizarSolicitud(id: number, solicitudActualizar: Partial<SolicitudServicio>): Observable<SolicitudServicio> {
    return this.apiService.put<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, solicitudActualizar);
  }

  // Eliminar una solicitud de servicio
  eliminarSolicitud(id: number): Observable<void> {
    return this.apiService.put<void>(`${this.path}?id_solicitud=eq.${id}`, { estado_solicitud: 'cancelado' });
  }
}
