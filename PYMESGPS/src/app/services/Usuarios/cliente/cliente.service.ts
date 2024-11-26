import { Injectable } from '@angular/core';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { CrearCliente } from 'src/app/models/Crear/Usuarios/crearCliente';
import { ActualizarCliente } from 'src/app/models/Actualizar/Usuarios/actualizarCliente';
import { ApiConfigService } from '../../apiconfig/apiconfig.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private path = 'cliente';

  constructor(private apiService: ApiConfigService) { }

  obtenerClientePorId(id: number): Observable<Cliente> {
    const params = new HttpParams().set('id_cliente', `eq.${id}`);
    return this.apiService.get<Cliente[]>(this.path, { params }).pipe(
      map((response) => {
        const clientes = response.body;
        if (!clientes || clientes.length === 0) {
          throw new Error(`No se encontró el cliente con ID ${id}.`);
        }
        return clientes[0];
      }),
      catchError(this.handleError)
    );
  }

  obtenerClientePorUsername(username: string): Observable<Cliente[]> {
    const params = new HttpParams().set('username', `eq.${username}`);
    return this.apiService.get<Cliente[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }

  obtenerClientes(): Observable<Cliente[]> {
    const params = new HttpParams()
      .set('select', '*')
      .set('estado', 'eq.true'); // Filtrar por estado activo
    return this.apiService.get<Cliente[]>(this.path, { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }


  registrarCliente(cliente: CrearCliente): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.path, cliente).pipe(
      map((response) => response.body as Cliente),
      catchError(this.handleError)
    );
  }

  actualizarCliente(id: number, cliente: ActualizarCliente): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.path}?id_cliente=eq.${id}`, cliente).pipe(
      map((response) => response.body as Cliente),
      catchError(this.handleError)
    );
  }

  eliminarCliente(id: number): Observable<void> {
    const data = { estado: false }; // Cambiar a inactivo
    return this.apiService.patch<void>(`${this.path}?id_cliente=eq.${id}`, data).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }
  
  activarCliente(id: number): Observable<void> {
    const data = { estado: true }; // Cambiar a activo
    return this.apiService.put<void>(`${this.path}?id_cliente=eq.${id}`, data).pipe(
      map(() => undefined),
      catchError(this.handleError)
    );
  }
  
  actualizarImagen(idCliente: number, imagenUrl: string): Observable<any> {
    const path = `cliente?id_cliente=eq.${idCliente}`;
    return this.apiService.patch(path, { imagen_perfil: imagenUrl });
  }

  esCliente(id_cliente: number): Observable<boolean> {
    const params = new HttpParams().set('id_cliente', `eq.${id_cliente}`);
    return this.apiService.get<Cliente[]>(this.path, { params }).pipe(
      map((response) => (response.body || []).length > 0),
      catchError(this.handleError)
    );
  }

  actualizarEstadoPedido(idSolicitud: number, nuevoEstado: string): Observable<void> {
    const path = `solicitud_servicio?id_solicitud=eq.${idSolicitud}`;
    const body = { estado: nuevoEstado }; // Cambia "estado" al campo correcto en tu base de datos

    // Se asegura que devuelva `Observable<void>`
    return this.apiService.patch<HttpResponse<void>>(path, body).pipe(
      map(() => undefined), // Mapea explícitamente a `void`
      catchError(this.handleError)
    );
  }


  obtenerSolicitudesConClientesYLotes(): Observable<any[]> {
    const params = new HttpParams().set(
      'select',
      `id_solicitud,cliente(id_cliente,nombre_completo,direccion,comuna,region,telefono,latitud,longitud),lote(id_lote,nombre_lote,descripcion_lote)`
    );

    return this.apiService.get<any[]>('solicitud_servicio', { params }).pipe(
      map((response) => response.body || []),
      catchError(this.handleError)
    );
  }


  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error en la operación del servicio de clientes'));
  }
}
