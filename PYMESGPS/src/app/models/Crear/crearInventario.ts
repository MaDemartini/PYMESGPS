export interface CrearInventario {
  id_inventario?: number;  // Propiedad opcional, ya que no es necesaria al crear
  cantidad_disponible: number;
  umbral_reabastecimiento: number;
  fecha_actualizacion: Date;
}
