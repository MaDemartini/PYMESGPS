export interface Cliente {
  id_cliente?: number;
  nombre_cliente: string;
  apellido_cliente?: string;
  correo_cliente: string;
  direccion?: string;
  region?: string;
  comuna?: string;
  telefono?: string;
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
}
