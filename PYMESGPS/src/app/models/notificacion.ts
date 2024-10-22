export interface Notificacion {
  id_notificacion?: number;
  id_usuario: number;
  id_role: number; 
  titulo: string;
  mensaje: string;
  leido: boolean;
  fecha: Date;
}
