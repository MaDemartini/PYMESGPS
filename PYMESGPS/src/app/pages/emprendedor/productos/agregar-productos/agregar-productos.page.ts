import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { lastValueFrom, firstValueFrom } from 'rxjs';
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
      // Paso 1: Crear el inventario sin id_inventario
      const nuevoInventario: CrearInventario = {
        cantidad_disponible: this.productoForm.value.cantidad_disponible,
        umbral_reabastecimiento: this.productoForm.value.umbral_reabastecimiento,
        fecha_actualizacion: new Date(),
      };

      // console.log("Creando inventario:", nuevoInventario);

      // Crear inventario y recibir el id generado
      const responseInventario = await lastValueFrom(this.inventarioService.agregarInventario(nuevoInventario));
      const inventarioCreado = Array.isArray(responseInventario) ? responseInventario[0] : responseInventario;

      // console.log("Inventario creado con éxito:", inventarioCreado);

      const inventarioCreadoId = inventarioCreado?.id_inventario;
      if (inventarioCreadoId == null) {
        throw new Error('Error al crear el inventario. La respuesta no contiene id_inventario.');
      }

      // Paso 2: Crear el producto usando el id_inventario generado
      const nuevoProducto: CrearProducto = {
        nombre_producto: this.productoForm.value.nombre_producto,
        descripcion_producto: this.productoForm.value.descripcion_producto,
        precio_prod: this.productoForm.value.precio_prod,
        estado_prod: true,
        id_emprendedor: this.id_emprendedor,
        id_inventario: inventarioCreadoId
      };

      // console.log("Creando producto:", nuevoProducto);

      const productoCreado = await firstValueFrom(this.productoService.agregarProducto(nuevoProducto));
      // console.log("Producto creado con éxito:", productoCreado);

      if (!productoCreado || productoCreado.id_producto) {
        throw new Error('Error al crear el producto. La respuesta no contiene id_producto.');
      }

      console.info('Producto e inventario agregados y vinculados correctamente');
      this.router.navigate(['/productos']);
    } catch (error) {
      console.error('Error al agregar producto e inventario:', error);
    }
  }

  volver() {
    this.router.navigate(['/productos']);
  }
}


