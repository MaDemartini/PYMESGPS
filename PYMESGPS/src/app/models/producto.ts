import { Usuario } from "./usuario";

export interface Producto {
  id_producto?: number;
  nombre_producto: string;
  descripcion_producto?: string;
  codigo_qr_producto?: string;
  id_emprendedor: Usuario;
  cantidad_inventario?: number;
  precio_producto?: number;
  estado_prod?: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
}
