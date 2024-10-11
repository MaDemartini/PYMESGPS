import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { Observable, of } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
import { map, catchError } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {

  constructor(private _serviceUsuario: UsuarioService) { }

  autenticar(username: string, password: string): Observable<boolean> {
    return this._serviceUsuario.obtenerUsuarios().pipe(
      map((usuarios: Usuario[]) => {
        // Encontrar al usuario con el username especificado
        const usuarioEncontrado = usuarios.find(usuario => usuario.username === username);
        if (!usuarioEncontrado) {
          // Si el usuario no existe, devolvemos false
          return false;
        }
        // Comparar la contraseña ingresada con la contraseña almacenada usando bcrypt
        const passwordValida = bcrypt.compareSync(password, usuarioEncontrado.contraseña_us);
        return passwordValida;
      }),
      catchError(error => {
        console.error('Error al autenticar usuario:', error);
        // Si ocurre un error, devolvemos 'false' indicando que la autenticación falló
        return of(false);
      })
    );
  }
}
