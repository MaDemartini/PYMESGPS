import { Lote } from './lote';

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto: string;
  codigo_qr_producto: string;
  lote: Lote; // Relación directa con la tabla de lotes
  cantidad_inventario: number;
  precio: number; // Precio agregado para tener datos de venta
  ultima_actualizacion: Date;
}
