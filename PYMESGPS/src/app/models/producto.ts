import { Inventario } from './inventario';  // Importamos el modelo Inventario

export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto?: string;
  codigo_qr_producto?: string;
  id_emprendedor: number;
  precio_prod: number;
  estado_prod: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  id_inventario: number;  // Relación con inventario
  inventario?: Inventario;  // Relación directa al objeto Inventario
}
