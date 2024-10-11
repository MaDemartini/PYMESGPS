import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { HistorialEntrega } from 'src/app/models/historial-entregas';
import { Observable } from 'rxjs';
import { CrearHistorialEntrega } from 'src/app/models/Crear/crearHistorialEntrega';
import { ActualizarHistorialEntrega } from 'src/app/models/Actualizar/actualizarHistorialEntrega';

@Injectable({
  providedIn: 'root'
})
export class HistorialEntregaService {
  private path = 'historial_entregas';

  constructor(private apiService: ApiConfigService) { }

  // Obtener el historial de entregas
  obtenerHistorial(): Observable<HistorialEntrega[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<HistorialEntrega[]>(this.path, { params });
  }

  // Obtener un registro de historial por ID
  obtenerHistorialPorId(id: number): Observable<HistorialEntrega> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<HistorialEntrega>(`${this.path}?id_historial=eq.${id}`, { params });
  }

  // Agregar un nuevo registro de historial de entrega
  agregarNuevoHistorial(historial: CrearHistorialEntrega): Observable<HistorialEntrega> {
    return this.apiService.post<HistorialEntrega>(this.path, historial);
  }

  // Actualizar un registro de historial de entrega existente
  actualizarHistorial(id: number, historialActualizar: ActualizarHistorialEntrega): Observable<HistorialEntrega> {
    return this.apiService.put<HistorialEntrega>(`${this.path}?id_historial=eq.${id}`, historialActualizar);
  }

  // Eliminar un registro de historial de entrega (cambiar el estado a "eliminado")
  eliminarHistorial(id: number): Observable<void> {
    const data = { estado: 'eliminado' };
    return this.apiService.put<void>(`${this.path}?id_historial=eq.${id}`, data);
  }
}
