import { Lote } from '../lote';
import { TipoEstadoEntrega } from '../tipoEstadoEntrega';

export interface CrearHistorialEntrega {
  id_lote: Lote;
  id_tipo_estado: TipoEstadoEntrega;
  fecha_cambio?: Date;
}
