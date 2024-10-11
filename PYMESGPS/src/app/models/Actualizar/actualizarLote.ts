import { Usuario } from '../usuario';

export interface ActualizarLote {
  codigo_seguimiento?: string;
  id_cliente?: Usuario; // Relación con el cliente
  id_emprendedor?: Usuario; // Relación con el emprendedor
  estado_lote?: string;
  fecha_modificacion?: Date;
}
