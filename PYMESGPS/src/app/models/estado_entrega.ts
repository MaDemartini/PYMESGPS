import { Lote } from './lote';
import { TipoEstadoEntrega } from './tipo_estado_entrega';

export interface EstadoEntrega {
  id_estado: number;
  id_lote: Lote;
  id_tipo_estado: TipoEstadoEntrega;
  fecha_cambio: Date;
}
