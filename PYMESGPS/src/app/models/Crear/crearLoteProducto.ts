export interface CrearLoteProducto {
    id_lote: number;
    id_producto: number;
    cantidad: number;
    estado_producto?: string; // Estado del producto en el lote, por ejemplo, "pendiente", "en tránsito", "entregado"
  }
  