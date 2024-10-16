import { Role } from "./role";

export interface Repartidor {
  id_repartidor: number;
  nombre_completo: string;
  correo: string;
  username: string;
  contrasena: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  id_role: Role;
}
