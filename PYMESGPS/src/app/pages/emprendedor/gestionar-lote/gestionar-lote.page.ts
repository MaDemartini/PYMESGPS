import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { Producto } from 'src/app/models/producto';
import { Emprendedor } from 'src/app/models/Usuarios/emprendedor';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { ProductoService } from 'src/app/services/productos/productos.service';
import { LoteService } from 'src/app/services/lote/lote.service';
import { LoteProductoService } from 'src/app/services/lote-producto/lote-producto.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { Lote } from 'src/app/models/lote';
import { firstValueFrom } from 'rxjs';
import { LoteProducto } from 'src/app/models/lote_producto';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { LoteProductoSimplificado } from 'src/app/models/loteproductosimplificado';
import { ToastController } from '@ionic/angular';
import { InventarioService } from 'src/app/services/inventario/inventario.service';

@Component({
  selector: 'app-gestionar-lote',
  templateUrl: './gestionar-lote.page.html',
  styleUrls: ['./gestionar-lote.page.scss'],
})
export class GestionarLotePage implements OnInit {
  clientes: Cliente[] = [];
  productos: Producto[] = [];
  emprendedor: Emprendedor | null = null;

  lote: Lote = {
    id_lote: 0,
    nombre_lote: '',
    descripcion_lote: '',
    id_cliente: 0,
    id_emprendedor: 0,
    precio_lote: 0,
    codigo_seguimiento: '',
    fecha_creacion: undefined,
    fecha_modificacion: undefined
  };

  loteProductos: LoteProducto[] = [];
  productoSeleccionado: Producto | null = null;
  clienteSeleccionado: Cliente | null = null;
  cantidadSeleccionada: number = 0;
  cantidadDisponible: number = 0;

  constructor(
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private loteService: LoteService,
    private loteProductoService: LoteProductoService,
    private authService: AuthServiceService,
    private emprendedorService: EmprendedorService,
    private router: Router,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    try {
      this.clientes = await firstValueFrom(this.clienteService.obtenerClientes());
      const usuarioLogueado = await this.authService.getDecryptedUserData();
      if (usuarioLogueado && usuarioLogueado.id_emprendedor) {
        this.emprendedor = await firstValueFrom(this.emprendedorService.obtenerEmprendedorPorId(usuarioLogueado.id_emprendedor));
        this.lote.id_emprendedor = this.emprendedor.id_emprendedor;
        this.productos = await firstValueFrom(this.productoService.obtenerProductosPorEmprendedor(this.emprendedor.id_emprendedor));
      }
    } catch (error) {
      this.mostrarMensaje('Error al cargar los datos iniciales.', 'danger');
      console.error('Error al cargar los datos iniciales:', error);
    }
  }

  seleccionarProducto(producto: Producto | null) {
    this.productoSeleccionado = producto;
    this.cantidadDisponible = producto ? producto.inventario.cantidad_disponible : 0;
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.lote.id_cliente = cliente.id_cliente; 
  }

  agregarProducto() {
    if (!this.productoSeleccionado) {
      this.mostrarMensaje('Producto no disponible.', 'danger');
      return;
    }

    if (this.cantidadSeleccionada <= 0 || this.cantidadSeleccionada > this.cantidadDisponible) {
      this.mostrarMensaje('Cantidad inválida o excede el inventario disponible.', 'danger');
      return;
    }

    const nuevoLoteProducto: LoteProducto = {
      id_lote_producto: 0,
      id_lote: this.lote,
      id_producto: this.productoSeleccionado,
      cantidad: this.cantidadSeleccionada,
    };

    this.loteProductos.push(nuevoLoteProducto);
    this.cantidadDisponible -= this.cantidadSeleccionada; // Disminuir la cantidad disponible en la UI
    this.productoSeleccionado!.inventario.cantidad_disponible = this.cantidadDisponible; // Actualizar la cantidad en el objeto de producto

    this.calcularPrecioLote();
    this.mostrarMensaje('Producto agregado al lote.', 'success');
    this.cantidadSeleccionada = 0;
  }

  calcularPrecioLote() {
    this.lote.precio_lote = this.loteProductos.reduce((total, loteProducto) => {
      const producto = this.productos.find(p => p.id_producto === loteProducto.id_producto.id_producto);
      return producto ? total + (producto.precio_prod * loteProducto.cantidad) : total;
    }, 0);
  }

  async guardarLote() {
    try {
      if (this.emprendedor && this.lote.id_cliente) {
        this.lote.codigo_seguimiento = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.lote.fecha_creacion = new Date();
        this.lote.fecha_modificacion = new Date();

        const loteCreado = await firstValueFrom(this.loteService.crearLote({
          nombre_lote: this.lote.nombre_lote,
          descripcion_lote: this.lote.descripcion_lote,
          id_cliente: this.lote.id_cliente,
          id_emprendedor: this.lote.id_emprendedor,
          precio_lote: this.lote.precio_lote,
          codigo_seguimiento: this.lote.codigo_seguimiento,
          fecha_creacion: this.lote.fecha_creacion,
          fecha_modificacion: this.lote.fecha_modificacion,
        }));

        if (loteCreado && loteCreado.id_lote) {
          for (const loteProducto of this.loteProductos) {
            const nuevoLoteProducto: LoteProductoSimplificado = {
              id_lote: loteCreado.id_lote,
              id_producto: loteProducto.id_producto.id_producto,
              cantidad: loteProducto.cantidad,
            };

            await firstValueFrom(this.loteProductoService.agregarProductoAlLote(nuevoLoteProducto));

            const cantidadRestante = loteProducto.id_producto.inventario.cantidad_disponible - loteProducto.cantidad;

            if (cantidadRestante < 0) {
              throw new Error(`No hay suficiente inventario para el producto: ${loteProducto.id_producto.nombre_producto}`);
            }

            await firstValueFrom(this.inventarioService.actualizarInventario(loteProducto.id_producto.id_producto, {
              cantidad_disponible: cantidadRestante,
            }));
          }

          this.router.navigate(['/gestionar-lote']);
          //this.mostrarMensaje('Lote guardado correctamente.', 'success');
        } else {
          throw new Error('El lote no se creó correctamente en la base de datos.');
        }
      }
    } catch (error) {
      this.mostrarMensaje('Error al guardar el lote.', 'danger');
      console.error('Error al guardar el lote:', error);
    }
  }

  eliminarProducto(loteProducto: LoteProducto) {
    this.loteProductos = this.loteProductos.filter(lp => lp !== loteProducto);
    const producto = this.productos.find(p => p.id_producto === loteProducto.id_producto.id_producto);
    if (producto) {
      producto.inventario.cantidad_disponible += loteProducto.cantidad;
    }
    this.calcularPrecioLote();
    this.mostrarMensaje('Producto eliminado del lote.', 'success');
  }

  private async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: color === 'danger' ? 'warning' : 'checkmark-circle',
        }
      ]
    });
    toast.present();
  }

  volver() {
    this.router.navigate(['/home']);
  }

  verLotes() {
    this.router.navigate(['/lotes-creados']);
  }
}
