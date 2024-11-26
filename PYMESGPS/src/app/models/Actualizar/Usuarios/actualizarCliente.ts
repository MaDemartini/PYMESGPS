export interface ActualizarCliente {
  nombre_completo?: string;
  correo?: string;
  username?: string;
  contrasena?: string;
  direccion?: string;
  region?: string;
  comuna?: string;
  telefono?: string;
  id_role?: number;  
  imagen_perfil?: string; // URL de la imagen de perfil
  estado: boolean;
}
