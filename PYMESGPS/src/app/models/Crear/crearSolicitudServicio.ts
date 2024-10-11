import { Usuario } from '../usuario';
import { Cliente } from '../cliente';

export interface CrearSolicitudServicio {
  id_emprendedor: Usuario;  // Relación con el emprendedor
  id_reparador?: Usuario;   // Relación con el repartidor, puede ser opcional
  id_cliente: Cliente;      // Relación con el cliente
  nombre_servicio: string;
  estado_solicitud: string;
  fecha_solicitud?: Date;   
  observacion?: string;     // Campo opcional para agregar una nota o comentario
}
