import { EstadoEntrega } from './estado_entrega';
import { Lote } from './lote';

export interface HistorialEntrega {
  id_historial: number;
  id_lote: Lote;
  id_estado: EstadoEntrega;
  descripcion: string;
  fecha_actualizacion: Date;
}
