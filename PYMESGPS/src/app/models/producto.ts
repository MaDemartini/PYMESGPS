import { Emprendedor } from './Usuarios/emprendedor';

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto?: string;
  codigo_qr_prod?: string;
  id_emprendedor: Emprendedor;
  cantidad_inventario: number;
  precio_prod: number;
  estado_prod: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
}
