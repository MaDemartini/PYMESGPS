import { Emprendedor } from './Usuarios/emprendedor';
import { Repartidor } from './Usuarios/repartidor';
import { Cliente } from './Usuarios/cliente';
import { Lote } from './lote';
import { EstadoSolicitudServicio } from './estado_solicitud_servicio';

export interface SolicitudServicio {
  id_solicitud: number;
  id_emprendedor: Emprendedor;
  id_repartidor: Repartidor;
  id_cliente: Cliente;
  id_lote: Lote;
  estado_solicitud: EstadoSolicitudServicio;
  fecha_solicitud: Date;
  observacion?: string;
}
