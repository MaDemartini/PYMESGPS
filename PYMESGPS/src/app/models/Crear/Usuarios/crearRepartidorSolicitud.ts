export interface CrearRepartidorSolicitud {
  nombre_completo: string;
  correo: string;
  username: string;
  id_emprendedor: number;  // Se relaciona con el emprendedor que hace la solicitud
  id_estado_solicitud: number; // Estado inicial de la solicitud, típicamente "pendiente"
}
