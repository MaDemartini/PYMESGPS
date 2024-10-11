export interface CrearInventario {
    id_producto: number;
    cantidad_disponible: number;
    fecha_reabastecimiento?: Date;
    estado_inventario?: string;
  }
  