export interface CrearEstadoEntrega {
  id_lote: number;  // Relación con la tabla Lote
  id_tipo_estado: number;  // Relación con la tabla TipoEstadoEntrega
  fecha_cambio: Date;
}
