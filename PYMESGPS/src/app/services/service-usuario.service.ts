import { Injectable } from '@angular/core'; // Servicio inyectable en otros componentes.
import { Usuario } from '../models/usuario'; // Modelo de usuario.
import * as bcrypt from 'bcryptjs'; // Biblioteca para encriptar contraseñas.

@Injectable({
  providedIn: 'root'
})
export class ServiceUsuarioService {

  private lista_de_usuarios: Usuario[] = [
    {
      id_usuario: 1,
      nombre_completo: "Juan Perez",
      correo_us: "jperez@example.com",
      contrasena_us: bcrypt.hashSync("jperez123", 10), // Contraseña encriptada.
      rol: { 
        id_rol: 1, 
        nombre_rol: "admin", 
        descripcion: "Administrador del sistema" // Rol del usuario.
      },
      fecha_creacion: new Date() // Fecha de creación del usuario.
    },
    {
      id_usuario: 2,
      nombre_completo: "Mario Demartini",
      correo_us: "ma.demartini@duocuc.com",
      contrasena_us: bcrypt.hashSync("demartini123", 10), // Contraseña encriptada.
      rol: { 
        id_rol: 2, 
        nombre_rol: "emprendedor", 
        descripcion: "Usuario emprendedor" // Rol del usuario.
      },
      fecha_creacion: new Date() // Fecha de creación del usuario.
    }
  ];

  constructor() { } // Constructor vacío.

  validar_usuario(correo: string, contrasena: string): Usuario | null {
    const usuario = this.lista_de_usuarios.find(u => u.correo_us === correo); // Busca usuario por correo.
    if (usuario && bcrypt.compareSync(contrasena, usuario.contrasena_us)) { // Valida contraseña.
      return usuario; // Retorna el usuario si la validación es exitosa.
    }
    return null; // Retorna null si falla la validación.
  }
  
  registrarUsuario(usuario: Usuario): void {
    const usuarioExistente = this.lista_de_usuarios.find(u => u.correo_us === usuario.correo_us); // Verifica si ya existe el correo.
    if (!usuarioExistente) {
      const salt = bcrypt.genSaltSync(10); // Genera salt para encriptar la contraseña.
      usuario.contrasena_us = bcrypt.hashSync(usuario.contrasena_us, salt); // Encripta la contraseña.
      usuario.fecha_creacion = new Date();  // Asigna la fecha de creación actual.
      this.lista_de_usuarios.push(usuario); // Agrega el nuevo usuario a la lista.
    } else {
      console.error('El usuario ya está registrado con este correo electrónico.'); // Error si el correo ya está registrado.
    }
  }
}
