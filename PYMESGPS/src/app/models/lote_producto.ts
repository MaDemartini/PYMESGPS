import { Lote } from './lote';
import { Producto } from './producto';

export interface LoteProducto {
  id_lote_producto: number;
  id_lote: Lote;
  id_producto: Producto;
  cantidad: number;
}
