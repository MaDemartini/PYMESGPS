import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Cliente } from 'src/app/models/cliente';
import { Observable } from 'rxjs';
import { CrearCliente } from 'src/app/models/Crear/crearCliente';
import { ActualizarCliente } from 'src/app/models/Actualizar/actualizarCliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private path = 'cliente';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los clientes
  obtenerClientes(): Observable<Cliente[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Cliente[]>(this.path, { params });
  }

  // Obtener un cliente por ID
  obtenerClientePorId(id: number): Observable<Cliente> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Cliente>(`${this.path}?id_cliente=eq.${id}`, { params });
  }

  // Agregar un nuevo cliente
  agregarNuevoCliente(cliente: CrearCliente): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.path, cliente);
  }

  // Actualizar un cliente existente
  actualizarCliente(id: number, clienteActualizar: ActualizarCliente): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.path}?id_cliente=eq.${id}`, clienteActualizar);
  }

  // Eliminar un cliente
  eliminarCliente(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_cliente=eq.${id}`);
  }
}
