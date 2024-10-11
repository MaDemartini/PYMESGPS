import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiConfigService } from '../apiconfig/apiconfig.service';
import { Usuario } from 'src/app/models/usuario';
import { Observable } from 'rxjs';
import { CrearUsuario } from 'src/app/models/Crear/crearUsuario';
import { ActualizarUsuario } from 'src/app/models/Actualizar/actualizarUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private path = 'usuario';

  constructor(private apiService: ApiConfigService) { }

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<Usuario[]> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Usuario[]>(this.path, { params });
  }

  // Obtener un usuario por ID
  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    const params = new HttpParams().set('select', '*');
    return this.apiService.get<Usuario>(`${this.path}?id_usuario=eq.${id}`, { params });
  }

  // Agregar un nuevo usuario
  agregarNuevoUsuario(usuario: CrearUsuario): Observable<Usuario> {
    return this.apiService.post(this.path, usuario);
  }

  // Actualizar un usuario existente
  actualizarUsuario(id: number, usuarioActualizar: ActualizarUsuario): Observable<Usuario> {
    return this.apiService.put(`${this.path}?id_usuario=eq.${id}`, usuarioActualizar);
  }

  // Eliminar un usuario
  eliminarUsuario(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.path}?id_usuario=eq.${id}`);
  }
}
