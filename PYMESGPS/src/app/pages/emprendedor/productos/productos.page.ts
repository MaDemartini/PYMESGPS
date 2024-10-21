import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ProductoService } from 'src/app/services/productos/productos.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

@Component({
  selector: 'app-producto',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  searchTerm: string = '';

  constructor(
    private authService: AuthServiceService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  // Cargar productos y su inventario
  async cargarProductos() {
    try {
      const usuario = await this.authService.getDecryptedUserData(); // Obtener datos del emprendedor
      if (usuario && usuario.id_emprendedor) {
        this.productos = await lastValueFrom(this.productoService.obtenerProductosPorEmprendedor(usuario.id_emprendedor));
        this.productosFiltrados = this.productos;
      }
    } catch (error) {
      console.error('Error al cargar productos', error);
    }
  }

  // Función para buscar productos
  buscarProducto(event: any) {
    const valorBuscado = event.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(valorBuscado) ||
      producto.descripcion_producto?.toLowerCase().includes(valorBuscado)
    );
  }

  // Navegar a la página para agregar un producto
  agregarProducto() {
    this.router.navigate(['/productos/agregar-productos']);
  }

  // Navegar a la página para editar un producto
  editarProducto(idProducto: number) {
    this.router.navigate([`/productos/actualizar-productos/${idProducto}`]);
  }

  // Eliminar un producto
  async eliminarProducto(idProducto: number) {
    try {
      await lastValueFrom(this.productoService.eliminarProducto(idProducto));
      this.cargarProductos();  // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar producto', error);
    }
  }

  // Función para volver al login del emprendedor
  async volver() {
    const usuario = await this.authService.getDecryptedUserData();  // Obtener datos desencriptados del usuario
    if (usuario) {
      if (usuario.id_cliente) {
        this.router.navigate(['/home-cliente']);
      } else if (usuario.id_emprendedor) {
        this.router.navigate(['/home']);
      } else if (usuario.id_repartidor) {
        this.router.navigate(['/home']);
      } else if (usuario.id_admin) {
        this.router.navigate(['/home-admin']);
      }
    } else {
      this.router.navigate(['/login']);  // En caso de que no se pueda determinar el tipo de usuario, redirigir al login
    }
  }
}
