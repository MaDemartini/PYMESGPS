export interface CrearInventario {
  id_inventario?: number;  
  cantidad_disponible: number;
  umbral_reabastecimiento: number;
  fecha_actualizacion: Date;
}
