import { Role } from './role';

export interface Usuario {
  id_usuario?: number;
  correo_us: string;
  contraseña_us: string;
  nombre_completo: string;
  rol: Role;
  username: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
}
