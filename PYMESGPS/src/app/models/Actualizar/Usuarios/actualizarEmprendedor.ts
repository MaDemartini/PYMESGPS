export interface ActualizarEmprendedor {
  nombre_completo?: string;
  correo?: string;
  username?: string;
  contrasena?: string;
  id_role?: number;  
  imagen_perfil?: string; // URL de la imagen de perfil
  estado: boolean;
}
