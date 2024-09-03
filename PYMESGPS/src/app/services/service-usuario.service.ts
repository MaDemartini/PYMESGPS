import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario'; // Ajusta la ruta según tu estructura de carpetas
import bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceUsuarioService {

  private lista_de_usuarios: Usuario[] = [
    {
      id_usuario: 1,
      nombre_completo: "Juan Perez",
      correo_us: "jperez@example.com",
      contraseña_us: bcrypt.hashSync("jperez123", 10),
      rol: { 
        id_rol: 1, 
        nombre_rol: "admin", 
        descripcion: "Administrador del sistema" 
      },
      fecha_creacion: new Date()
    },
    {
      id_usuario: 2,
      nombre_completo: "Mario Demartini",
      correo_us: "mdemartini@example.com",
      contraseña_us: bcrypt.hashSync("mdemartini123", 10),
      rol: { 
        id_rol: 2, 
        nombre_rol: "emprendedor", 
        descripcion: "Usuario emprendedor" 
      },
      fecha_creacion: new Date()
    }
  ];

  constructor() { }

  validar_usuario(correo: string, contraseña: string): boolean {
    const usuario = this.lista_de_usuarios.find(u => u.correo_us === correo);
    if (usuario && bcrypt.compareSync(contraseña, usuario.contraseña_us)) {
      return true;
    }
    return false;
  }

  registrarUsuario(usuario: Usuario): void {
    const salt = bcrypt.genSaltSync(10);
    usuario.contraseña_us = bcrypt.hashSync(usuario.contraseña_us, salt);
    this.lista_de_usuarios.push(usuario);
  }
}
