export interface Producto {
  id_producto: number;
  nombre_producto: string;
  descripcion_producto?: string;
  id_emprendedor: number;
  precio_prod: number;
  estado_prod: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  id_inventario: number;
  inventario?: {
    id_inventario: number;
    cantidad_disponible: number;
    umbral_reabastecimiento?: number;
    fecha_actualizacion?: Date;
  };
}
