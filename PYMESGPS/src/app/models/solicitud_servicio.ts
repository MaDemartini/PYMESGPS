export interface SolicitudServicio {
  id_solicitud?: number;
  id_emprendedor: number; 
  id_repartidor: number; 
  id_cliente: number;    
  id_lote: number;   
  fecha_solicitud: Date;
  observacion: string;
  id_estado_solicitud: number; 
  cliente?: { nombre_cliente: string }; 
  estado_solicitud?: { nombre_estado: string }; 
}
