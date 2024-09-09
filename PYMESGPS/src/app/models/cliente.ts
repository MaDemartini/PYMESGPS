export interface Cliente {
    id_cliente: number;
    nombre_completo: string;
    correo_cliente: string;
    telefono_cliente?: string;
    direccion_cliente?: string;
    codigo_confirmacion: string;
    estado_codigo: string; // Estado del código de confirmación ('activo', 'inactivo')
    fecha_registro: Date;
  }
  