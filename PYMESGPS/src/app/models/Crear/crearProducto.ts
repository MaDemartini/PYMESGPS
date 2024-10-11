import { Usuario } from '../usuario';

export interface CrearProducto {
  nombre_prod: string;  
  descripcion_prod?: string;  
  codigo_qr_prod?: string;  
  id_emprendedor: Usuario;  // Relación con el emprendedor (Usuario)
  cantidad_inventario?: number;
  precio_prod?: number; 
  estado_prod?: string;  // Estado inicial del producto
}
