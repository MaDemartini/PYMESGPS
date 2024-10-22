// eliminar-productos.page.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-eliminar-productos',
  templateUrl: './eliminar-productos.page.html',
  styleUrls: ['./eliminar-productos.page.scss'],
})
export class EliminarProductosPage implements OnInit {
  id_producto: number | undefined;
  id_inventario: number | undefined;  // Para almacenar el id_inventario del producto

  constructor(
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Obtener el id del producto desde los parámetros de la URL
    const id_producto = this.route.snapshot.paramMap.get('id');
    if (id_producto) {
      this.id_producto = +id_producto;
      await this.cargarDatosProducto();
    } else {
      console.error('Producto no encontrado');
      this.router.navigate(['/productos']);
    }
  }

  // Cargar datos del producto, incluyendo el inventario relacionado
  async cargarDatosProducto() {
    if (this.id_producto) {
      try {
        const producto = await firstValueFrom(this.productoService.obtenerProductoPorId(this.id_producto));
        if (producto && producto.id_inventario) {
          this.id_inventario = producto.id_inventario;  // Asignamos el id_inventario
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      }
    }
  }

  // Eliminar producto e inventario asociado
  async eliminarProducto() {
    if (!this.id_producto) {
      console.error('Producto no encontrado');
      return;
    }

    try {
      // Si hay un inventario asociado, lo eliminamos primero
      if (this.id_inventario) {
        await firstValueFrom(this.inventarioService.eliminarInventario(this.id_inventario));
        console.log('Inventario eliminado correctamente');
      }

      // Luego eliminamos el producto
      await firstValueFrom(this.productoService.eliminarProducto(this.id_producto));
      console.log('Producto eliminado correctamente');

      // Redirigir a la lista de productos
      this.router.navigate(['/productos']);
    } catch (error) {
      console.error('Error al eliminar producto o inventario:', error);
    }
  }

  // Volver a la lista de productos sin eliminar
  volver() {
    this.router.navigate(['/productos']);
  }
}
