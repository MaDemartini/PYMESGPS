import { Cliente } from './Usuarios/cliente';
import { Emprendedor } from './Usuarios/emprendedor';

export interface Lote {
  id_lote: number;
  nombre_lote: string;
  descripcion_lote: string;
  id_cliente: Cliente;
  id_emprendedor: Emprendedor;
  precio_lote: number;
  codigo_seguimiento: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
}
