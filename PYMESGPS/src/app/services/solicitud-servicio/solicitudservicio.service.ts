import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { SolicitudServicio } from 'src/app/models/solicitud-servicio';
import { Observable } from 'rxjs';
import { CrearSolicitudServicio } from 'src/app/models/Crear/crearSolicitudServicio';
import { ActualizarSolicitudServicio } from 'src/app/models/Actualizar/actualizarSolicitudServicio';

@Injectable({
  providedIn: 'root'
})
export class SolicitudServicioService {
  private path = 'solicitud_servicio';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todas las solicitudes de servicio
  obtenerSolicitudesServicio(): Observable<SolicitudServicio[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio[]>(this.path, { params });
  }

  // Obtener una solicitud de servicio por ID
  obtenerSolicitudServicioPorId(id: number): Observable<SolicitudServicio> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, { params });
  }

  // Agregar una nueva solicitud de servicio
  agregarNuevaSolicitudServicio(solicitudServicio: CrearSolicitudServicio): Observable<SolicitudServicio> {
    return this.apiService.post<SolicitudServicio>(this.path, solicitudServicio);
  }

  // Actualizar una solicitud de servicio existente
  actualizarSolicitudServicio(id: number, solicitudServicioActualizar: ActualizarSolicitudServicio): Observable<SolicitudServicio> {
    return this.apiService.put<SolicitudServicio>(`${this.path}?id_solicitud=eq.${id}`, solicitudServicioActualizar);
  }

  // Eliminar una solicitud de servicio
  eliminarSolicitudServicio(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_solicitud=eq.${id}`);
  }
}
