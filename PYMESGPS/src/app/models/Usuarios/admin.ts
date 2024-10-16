import { Role } from "./role";

export interface Admin {
  id_admin: number;
  nombre_completo: string;
  correo: string;
  username: string;
  contrasena: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  id_role: Role;
}
