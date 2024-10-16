import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { CrearCliente } from 'src/app/models/Crear/Usuarios/crearCliente';
import { ActualizarCliente } from 'src/app/models/Actualizar/Usuarios/actualizarCliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private path = 'cliente';

  constructor(private apiService: ApiConfigService) {}

  // Obtener un cliente por ID usando HttpParams
  obtenerClientePorId(id: number): Observable<Cliente> {
    const params = new HttpParams().set('id_cliente', `eq.${id}`);
    return this.apiService.get<Cliente>(this.path, { params });
  }

  obtenerClientePorUsername(username: string): Observable<any> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<any>(`cliente`, { params });
  }
  
  // Obtener todos los clientes
  obtenerClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(this.path);
  }

  // Registrar un nuevo cliente
  registrarCliente(cliente: CrearCliente): Observable<any> {
    return this.apiService.post(this.path, cliente);
  }

  // Actualizar un cliente existente usando HttpParams
  actualizarCliente(id: number, cliente: ActualizarCliente): Observable<any> {
    const params = new HttpParams().set('id_cliente', `eq.${id}`);
    return this.apiService.put(`${this.path}?id_cliente=eq.${id}`, cliente); 
  }

  // Eliminar un cliente usando HttpParams (soft delete cambiando el estado)
  eliminarCliente(id: number): Observable<void> {
    const data = { estado: 'inactivo' };
    return this.apiService.put<void>(`${this.path}?id_cliente=eq.${id}`, data); 
  }

  // Verificar si es cliente usando HttpParams
  esCliente(id_cliente: number): Observable<boolean> {
    const params = new HttpParams().set('id_cliente', `eq.${id_cliente}`);
    return this.apiService.get<any[]>(this.path, { params })
      .pipe(map((clientes: any[]) => clientes.length > 0));

  }
}
