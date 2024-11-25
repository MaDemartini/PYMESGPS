export interface CrearProducto {
  id_producto?: number;
  nombre_producto: string;
  descripcion_producto?: string;
  id_emprendedor: number;
  precio_prod: number;
  estado_prod: boolean;
  id_inventario: number;
}
