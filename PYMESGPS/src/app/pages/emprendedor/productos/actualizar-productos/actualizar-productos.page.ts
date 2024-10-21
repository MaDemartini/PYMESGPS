import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-actualizar-productos',
  templateUrl: './actualizar-productos.page.html',
  styleUrls: ['./actualizar-productos.page.scss'],
})
export class ActualizarProductosPage implements OnInit {
  productoForm: FormGroup;
  id_producto: number | undefined;
  id_inventario: number | undefined;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializar el formulario con las validaciones necesarias
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      descripcion_producto: [''],
      precio_prod: [0, [Validators.required, Validators.min(1)]],
      cantidad_disponible: [0, [Validators.required, Validators.min(1)]],
      umbral_reabastecimiento: [0, [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    // Obtener el ID del producto desde la URL
    const id_producto = this.route.snapshot.paramMap.get('id');
    if (id_producto) {
      this.id_producto = +id_producto;
      await this.cargarDatosProducto();
    } else {
      console.error('ID de producto no encontrado');
      this.router.navigate(['/productos']);
    }
  }

  // Cargar los datos del producto e inventario asociado
  async cargarDatosProducto() {
    if (this.id_producto) {
      try {
        const producto = await firstValueFrom(this.productoService.obtenerProductoPorId(this.id_producto));
        this.productoForm.patchValue({
          nombre_producto: producto.nombre_producto,
          descripcion_producto: producto.descripcion_producto,
          precio_prod: producto.precio_prod,
        });

        if (producto.id_inventario) {
          this.id_inventario = producto.id_inventario;  // Asignamos el id_inventario
          const inventario = await firstValueFrom(this.inventarioService.obtenerInventarioPorId(this.id_inventario));
          this.productoForm.patchValue({
            cantidad_disponible: inventario.cantidad_disponible,
            umbral_reabastecimiento: inventario.umbral_reabastecimiento,
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos del producto:', error);
      }
    }
  }

  // Actualizar los datos del producto e inventario
  async actualizarProducto() {
    if (this.productoForm.invalid || !this.id_producto || !this.id_inventario) {
      console.error('Formulario inválido o información faltante');
      return;
    }

    // Datos actualizados del producto
    const productoActualizado = {
      nombre_producto: this.productoForm.value.nombre_producto,
      descripcion_producto: this.productoForm.value.descripcion_producto,
      precio_prod: this.productoForm.value.precio_prod,
    };

    // Datos actualizados del inventario
    const inventarioActualizado = {
      cantidad_disponible: this.productoForm.value.cantidad_disponible,
      umbral_reabastecimiento: this.productoForm.value.umbral_reabastecimiento,
    };

    try {
      // Actualizar producto
      await firstValueFrom(this.productoService.actualizarProducto(this.id_producto, productoActualizado));
      console.log('Producto actualizado correctamente');

      // Actualizar inventario
      await firstValueFrom(this.inventarioService.actualizarInventario(this.id_inventario, inventarioActualizado));
      console.log('Inventario actualizado correctamente');

      // Redirigir a la lista de productos
      this.router.navigate(['/productos']);
    } catch (error) {
      console.error('Error al actualizar el producto o inventario:', error);
    }
  }

  // Volver a la lista de productos sin actualizar
  volver() {
    this.router.navigate(['/productos']);
  }
}
