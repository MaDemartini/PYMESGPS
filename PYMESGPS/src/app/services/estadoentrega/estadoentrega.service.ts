import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { EstadoEntrega } from 'src/app/models/estado-entrega';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoEntregaService {
  private path = 'estado_entrega';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los estados de entrega
  obtenerEstadosEntrega(): Observable<EstadoEntrega[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<EstadoEntrega[]>(this.path, { params });
  }

  // Obtener un estado de entrega por ID
  obtenerEstadoEntregaPorId(id: number): Observable<EstadoEntrega> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<EstadoEntrega>(`${this.path}?id_estado=eq.${id}`, { params });
  }
}
