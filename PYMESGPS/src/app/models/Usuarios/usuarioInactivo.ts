export interface UsuarioInactivo {
    id: number; 
    nombre_completo: string; 
    correo: string; 
    tipo: 'cliente' | 'emprendedor' | 'repartidor'; 
  }
  