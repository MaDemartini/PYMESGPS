export interface ActualizarProducto {
  nombre_producto: string;
  descripcion_producto?: string;
  codigo_qr_producto?: string;
  id_emprendedor: number;
  precio_prod: number;
  estado_prod: string;
  id_inventario: number;  // Relación directa con inventario
}
