export interface SolicitudServicio {
  id_solicitud?: number;
  id_emprendedor: number;
  id_repartidor: number;
  id_cliente: number;
  id_lote: number;
  fecha_solicitud: Date;
  observacion: string;
  id_estado_solicitud: number;

  // Relaciones
  cliente?: { id_cliente?: number; nombre_completo: string; direccion?: string } | null; // Incluye dirección
  repartidor?: { nombre_completo: string } | null;
  estado_solicitud?: { nombre_estado: string; descripcion_estado?: string } | null;
  lote?: {
    id_lote?: number;
    nombre_lote: string;
    codigo_seguimiento: string;
    descripcion_lote?: string;
    productos?: {
      cantidad: number;
      producto: {
        nombre_producto: string;
        precio_prod: number;
      };
    }[];
    historial_entrega?: {
      descripcion?: string;
      fecha_actualizacion?: string;
      tipo_estado_entrega?: {
        id_tipo_estado?: number;
        nombre_estado: string;
        descripcion_estado?: string;
      };
    }[];
  } | null;
}
