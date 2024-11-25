import { Inventario } from "./inventario";

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto?: string;
  id_emprendedor: number;
  cantidad: number;
  precio_prod: number;
  estado_prod: boolean;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  id_inventario: number;
  inventario: Inventario;
}
