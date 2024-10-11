import { Usuario } from '../usuario';

export interface CrearLote {
  codigo_seguimiento: string;
  id_cliente: Usuario; // Relación con el cliente
  id_emprendedor: Usuario; // Relación con el emprendedor
  estado_lote: string; // Estado inicial del lote
  fecha_creacion?: Date;
}
