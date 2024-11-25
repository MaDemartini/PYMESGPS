export interface CrearLote {
  id_lote?: number;
  nombre_lote: string;
  descripcion_lote: string;
  id_cliente: number;  // Relación con la tabla Cliente
  id_emprendedor: number;  // Relación con la tabla Emprendedor
  precio_lote: number;
  codigo_seguimiento: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;

}
