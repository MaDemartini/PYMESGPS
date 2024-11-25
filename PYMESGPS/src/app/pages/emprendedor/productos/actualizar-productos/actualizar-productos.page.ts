import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ProductoService } from 'src/app/services/productos/productos.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';

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
    private inventarioService: InventarioService, // Inyecta el InventarioService aquí
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Inicializar el formulario con validaciones
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      descripcion_producto: [''],
      precio_prod: [0, [Validators.required, Validators.min(1)]],
      cantidad_disponible: [0, [Validators.required, Validators.min(1)]],
      umbral_reabastecimiento: [0, [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    const id_producto = this.route.snapshot.paramMap.get('id');
    if (id_producto) {
      this.id_producto = +id_producto;
      await this.cargarDatosProducto();
    } else {
      console.error('ID de producto no encontrado');
      this.router.navigate(['/productos']);
    }
  }

  async cargarDatosProducto() {
    if (this.id_producto) {
      try {
        // Obtener el producto junto con su inventario
        const producto = await firstValueFrom(this.productoService.obtenerProductoPorId(this.id_producto));
        // console.log('Producto obtenido:', producto);
  
        // Actualizar el formulario con los datos del producto
        this.productoForm.patchValue({
          nombre_producto: producto.nombre_producto,
          descripcion_producto: producto.descripcion_producto,
          precio_prod: producto.precio_prod,
        });
  
        // Verificar si el producto tiene un inventario asociado y actualizar el formulario
        if (producto.inventario && producto.inventario.id_inventario) {
          this.id_inventario = producto.inventario.id_inventario; // Guardar el ID de inventario
          this.productoForm.patchValue({
            cantidad_disponible: producto.inventario.cantidad_disponible,
            umbral_reabastecimiento: producto.inventario.umbral_reabastecimiento,
          });
        } else {
          console.warn('El producto no tiene un inventario asociado.');
        }
      } catch (error) {
        console.error('Error al cargar los datos del producto:', error);
      }
    }
  }  

  async actualizarProducto() {
    if (this.productoForm.invalid || !this.id_producto || !this.id_inventario) {
      console.error('Formulario inválido o información faltante');
      return;
    }

    // Preparar los datos actualizados del producto
    const productoActualizado = {
      nombre_producto: this.productoForm.value.nombre_producto,
      descripcion_producto: this.productoForm.value.descripcion_producto,
      precio_prod: this.productoForm.value.precio_prod,
      fecha_modificacion: new Date() // Actualizar la fecha de modificación
    };

    // Preparar los datos actualizados del inventario
    const inventarioActualizado = {
      cantidad_disponible: this.productoForm.value.cantidad_disponible,
      umbral_reabastecimiento: this.productoForm.value.umbral_reabastecimiento,
      fecha_actualizacion: new Date() // Actualizar la fecha de actualización
    };

    try {
      // Actualizar el producto
      await lastValueFrom(this.productoService.actualizarProducto(this.id_producto, productoActualizado));
      // console.log('Producto actualizado correctamente');

      // Actualizar el inventario utilizando InventarioService
      await lastValueFrom(this.inventarioService.actualizarInventario(this.id_inventario, inventarioActualizado));
      // console.log('Inventario actualizado correctamente');

      // Navegar de vuelta a la lista de productos y forzar recarga
      this.router.navigate(['/productos']).then(() => {
        window.location.reload();
      });      
    } catch (error) {
      console.error('Error al actualizar el producto o inventario:', error);
    }
  }

  volver() {
    this.router.navigate(['/productos']);
  }
}
