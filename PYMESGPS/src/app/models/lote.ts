export interface Lote {
  id_lote?: number;
  nombre_lote: string;
  descripcion_lote: string;
  id_cliente: number;
  id_emprendedor: number;
  precio_lote: number;
  codigo_seguimiento: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
}
