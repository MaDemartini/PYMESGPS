export interface CrearProducto {
  nombre_producto: string;
  descripcion_producto?: string;
  codigo_qr_producto?: string;
  id_emprendedor: number;  // Relación con la tabla Emprendedor
  cantidad_inventario?: number;
  precio_producto?: number;
  estado_prod?: string;  // Estado inicial del producto
}
