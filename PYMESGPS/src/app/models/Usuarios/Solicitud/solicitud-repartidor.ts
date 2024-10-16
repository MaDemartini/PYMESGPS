import { Emprendedor } from '../emprendedor';
import { EstadoSolicitudRepartidor } from './estado-solicitud-repartidor';

export interface SolicitudRepartidor {
  id_solicitud_repartidor: number;
  nombre_completo: string;
  correo: string;
  username: string;
  id_emprendedor: Emprendedor; // Relación con el emprendedor
  id_estado_solicitud: EstadoSolicitudRepartidor; // Estado de la solicitud (aprobada, rechazada, pendiente)
  fecha_solicitud: Date;
  fecha_respuesta?: Date;  // Fecha de respuesta en caso de aprobación o rechazo
}
