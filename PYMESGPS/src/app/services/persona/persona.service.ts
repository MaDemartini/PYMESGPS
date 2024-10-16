import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Persona } from 'src/app/models/Usuarios/persona';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CrearEmprendedor } from 'src/app/models/Crear/Usuarios/crearEmprendedor';
import { CrearCliente } from 'src/app/models/Crear/Usuarios/crearCliente';
import { CrearRepartidor } from 'src/app/models/Crear/Usuarios/crearRepartidor';
import { CrearRepartidorSolicitud } from 'src/app/models/Crear/Usuarios/crearRepartidorSolicitud';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private path = 'persona';

  constructor(private apiService: ApiConfigService) { }

  // Obtener una persona por ID, incluyendo sus relaciones con roles (admin, emprendedor, repartidor, cliente)
  obtenerPersonaConRoles(id: number): Observable<Persona> {
    const params = new HttpParams().set('select', '*, admin(*), emprendedor(*), repartidor(*), cliente(*)');
    return this.apiService.get<Persona>(`${this.path}?id_persona=eq.${id}`, { params });
  }

  // Método para obtener una persona por su username, con sus roles relacionados
  obtenerPersonasPorUsername(username: string): Observable<Persona[]> {
    const params = new HttpParams().set('select', '*, admin(*), emprendedor(*), repartidor(*), cliente(*)')
                                    .set('username', `eq.${username}`);
    return this.apiService.get<Persona[]>(`${this.path}`, { params });
  }

  // Métodos de verificación de roles:
  esAdmin(id_persona: number): Observable<boolean> {
    return this.apiService.get<any[]>(`admin?id_persona=eq.${id_persona}`)
      .pipe(map((admins: any[]) => admins.length > 0));
  }

  esCliente(id_persona: number): Observable<boolean> {
    return this.apiService.get<any[]>(`cliente?id_persona=eq.${id_persona}`)
      .pipe(map((clientes: any[]) => clientes.length > 0));
  }

  esEmprendedor(id_persona: number): Observable<boolean> {
    return this.apiService.get<any[]>(`emprendedor?id_persona=eq.${id_persona}`)
      .pipe(map((emprendedores: any[]) => emprendedores.length > 0));
  }

  esRepartidor(id_persona: number): Observable<boolean> {
    return this.apiService.get<any[]>(`repartidor?id_persona=eq.${id_persona}`)
      .pipe(map((repartidores: any[]) => repartidores.length > 0));
  }
  
  // Otros métodos que ya tienes para registrar personas según su rol (emprendedor, cliente, repartidor)
  registrarEmprendedor(emprendedor: CrearEmprendedor): Observable<any> {
    return this.apiService.post('emprendedor', emprendedor);
  }

  registrarCliente(cliente: CrearCliente): Observable<any> {
    return this.apiService.post('cliente', cliente);
  }

  registrarRepartidor(repartidor: CrearRepartidor): Observable<any> {
    return this.apiService.post('repartidor', repartidor);
  }

  solicitarRepartidor(nuevoRepartidor: CrearRepartidorSolicitud): Observable<any> {
    return this.apiService.post('solicitud-repartidor', nuevoRepartidor);
  }
  
}
