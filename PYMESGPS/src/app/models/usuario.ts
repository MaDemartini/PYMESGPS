import { Rol } from './role';
import { Lote } from './lote';
import { SolicitudServicio } from './solicitud-servicio';

export interface Usuario {
  id_usuario: number;
  correo_us: string;
  contrasena_us: string;
  nombre_completo: string;
  rol: Rol; // Relación directa con la tabla de roles
  fecha_creacion: Date;
  repartidores?: Usuario[]; // Repartidores asociados si es emprendedor
  lotes?: Lote[]; // Lotes asociados al emprendedor
  solicitudes?: SolicitudServicio[]; // Solicitudes de servicio realizadas por emprendedores
}
