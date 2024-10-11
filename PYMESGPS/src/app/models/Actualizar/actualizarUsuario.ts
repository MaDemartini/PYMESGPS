import { Role } from '../role';

export interface ActualizarUsuario {
  nombre_completo?: string;
  correo_us?: string;
  username?: string;
  contraseña_us?: string;
  rol?: Role;  // Relación con el rol del usuario
}
