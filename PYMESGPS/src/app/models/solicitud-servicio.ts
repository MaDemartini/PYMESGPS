import { Usuario } from "./usuario";
import { Cliente } from "./cliente";
import { Lote } from "./lote";

export interface SolicitudServicio {
  id_solicitud?: number;
  id_emprendedor: Usuario;
  id_repartidor?: Usuario;
  id_cliente: Cliente;
  id_lote: Lote;
  estado_solicitud: string;
  fecha_solicitud?: Date;
  observacion?: string;
}
