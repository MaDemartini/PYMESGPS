import { Producto } from "./producto";

export interface Inventario {
  id_inventario?: number;
  id_producto: Producto;
  cantidad_disponible: number;
  umbral_reabastecimiento?: number;
  fecha_actualizacion?: Date;
}
