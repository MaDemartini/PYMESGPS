export interface CrearLote {
  nombre_lote: string;
  id_cliente: number;  // Relación con la tabla Cliente
  id_emprendedor: number;  // Relación con la tabla Emprendedor
  precio_lote: number;
  codigo_seguimiento: string;
}
