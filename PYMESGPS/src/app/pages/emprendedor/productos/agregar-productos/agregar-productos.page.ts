import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { lastValueFrom } from 'rxjs';
import { CrearProducto } from 'src/app/models/Crear/crearProducto';
import { CrearInventario } from 'src/app/models/Crear/crearInventario';
import { ProductoService } from 'src/app/services/productos/productos.service';

@Component({
  selector: 'app-agregar-productos',
  templateUrl: './agregar-productos.page.html',
  styleUrls: ['./agregar-productos.page.scss'],
})
export class AgregarProductosPage implements OnInit {
  productoForm: FormGroup;
  id_emprendedor: number | undefined;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private authService: AuthServiceService,
    private router: Router
  ) {
    // Inicializar el formulario
    this.productoForm = this.fb.group({
      nombre_producto: ['', [Validators.required]],
      descripcion_producto: [''],
      precio_prod: [0, [Validators.required, Validators.min(1)]],
      cantidad_disponible: [0, [Validators.required, Validators.min(1)]],
      umbral_reabastecimiento: [0, [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    await this.cargarEmprendedor();
  }

  async cargarEmprendedor() {
    const usuario = await this.authService.getDecryptedUserData();
    if (usuario && usuario.id_emprendedor) {
      this.id_emprendedor = usuario.id_emprendedor;
    } else {
      console.error('No se pudo cargar la información del emprendedor.');
      this.router.navigate(['/login']);
    }
  }

  async agregarProducto() {
    if (this.productoForm.invalid || !this.id_emprendedor) {
      console.error('Formulario inválido o emprendedor no encontrado');
      return;
    }

    try {
      // Crear el producto primero (sin id_inventario aún)
      const nuevoProducto: CrearProducto = {
        nombre_producto: this.productoForm.value.nombre_producto,
        descripcion_producto: this.productoForm.value.descripcion_producto,
        precio_prod: this.productoForm.value.precio_prod,
        estado_prod: 'activo',
        id_emprendedor: this.id_emprendedor,
      };
  
      // Intentar crear el producto
      const productoCreado = await lastValueFrom(this.productoService.agregarProducto(nuevoProducto));

      // Verificar que se generó el id_producto
      if (!productoCreado || !productoCreado.id_producto) {
        throw new Error('Error al crear el producto.');
      }

      console.log('Producto creado con ID:', productoCreado.id_producto);

      // Ahora que el producto está creado, creamos el inventario
      const nuevoInventario: CrearInventario = {
        cantidad_disponible: this.productoForm.value.cantidad_disponible,
        umbral_reabastecimiento: this.productoForm.value.umbral_reabastecimiento,
        fecha_actualizacion: new Date(),
      };

      const inventarioCreado = await lastValueFrom(this.inventarioService.agregarInventario(nuevoInventario));

      if (!inventarioCreado || !inventarioCreado.id_inventario) {
        throw new Error('Error al crear el inventario.');
      }

      // Actualizar el producto con el id_inventario generado
      const productoActualizado = {
        id_inventario: inventarioCreado.id_inventario
      };

      await lastValueFrom(this.productoService.actualizarProducto(productoCreado.id_producto, productoActualizado));

      console.info('Producto e inventario agregados correctamente');
      this.router.navigate(['/productos']);
    } catch (error) {
      console.error('Error al agregar producto e inventario:', error);
    }
  }

  volver() {
    this.router.navigate(['/productos']);
  }
}
