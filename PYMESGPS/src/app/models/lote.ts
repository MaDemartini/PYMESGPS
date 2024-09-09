import { Producto } from './producto';

export interface Lote {
  id_lote: number;
  nombre_lote: string;
  descripcion_lote: string;
  cantidad_productos: number;
  codigo_qr_lote: string;
  precio_total: number; // Precio del lote completo
  productos: Producto[]; // Productos incluidos en el lote
  fecha_creacion: Date;
}
