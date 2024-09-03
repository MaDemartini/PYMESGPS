import { Usuario } from './usuario';
import { Lote } from './lote';

export interface SolicitudServicio {
  id_solicitud: number;
  id_emprendedor: Usuario; // Referencia al usuario emprendedor que solicita el servicio
  id_repartidor: Usuario; // Referencia al usuario repartidor asignado
  id_lote: Lote; // Referencia al lote que será entregado
  codigo_qr_repartidor: string; // Código QR para el repartidor
  codigo_confirmacion_cliente: string; // Código de confirmación para el cliente
  estado_solicitud: string; // Estado actual de la solicitud ('Pendiente', 'En camino', 'Entregado', 'Fallido')
  fecha_solicitud: Date;
  observacion?: string; // Información adicional
}
