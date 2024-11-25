export interface CrearCliente {
  nombre_completo: string;
  correo: string;
  username: string;
  contrasena: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  id_role: number; 
  latitud?: number; // Coordenada opcional
  longitud?: number; // Coordenada opcional
}
