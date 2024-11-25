export interface HistorialEntregaRepartidor {
    id_historial?: number;
    id_solicitud: number; 
    id_repartidor: number; 
    descripcion?: string;
    fecha_actualizacion: Date; 
    
    
    solicitud?: {
      cliente: { nombre_completo: string };
      lote: { nombre_lote: string };
      emprendedor: { nombre_completo: string };
      estado_solicitud: { nombre_estado: string };
    };

  }
  