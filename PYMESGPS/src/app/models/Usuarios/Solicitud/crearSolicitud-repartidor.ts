import { EstadoSolicitudRepartidor } from "./estado-solicitud-repartidor";

export interface CrearSolicitudRepartidor {
  nombre_completo: string;
  correo: string;
  username: string;
  id_emprendedor: number;
  id_estado_solicitud: number; 
  estado_solicitud?: EstadoSolicitudRepartidor;  
  fecha_solicitud?: string;
  fecha_respuesta?: string;
  registrado?: boolean; 
}