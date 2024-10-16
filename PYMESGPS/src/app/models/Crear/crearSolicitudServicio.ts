export interface CrearSolicitudServicio {
  id_emprendedor: number;  // Relación con la tabla Emprendedor
  id_repartidor: number;  // Relación con la tabla Repartidor
  id_cliente: number;  // Relación con la tabla Cliente
  id_lote: number;  // Relación con la tabla Lote
  estado_solicitud: string;
  observacion?: string;
}
