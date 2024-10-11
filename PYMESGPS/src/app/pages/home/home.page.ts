import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { ProductosService } from 'src/app/services/productos/productos.service';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  productos: Producto[] = [];
  usuario: Usuario | undefined;
  codigoSeguimiento: string = ''; // Variable para el código de seguimiento

  constructor(
    private _serviceProducto: ProductosService,
    private _serviceUsuario: UsuarioService,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.cargarUsuario();
    this.cargarProductos();
  }

  openMenu() {
    this.menuCtrl.open(); // Abre el menú
  }

  closeMenu() {
    this.menuCtrl.close(); // Cierra el menú
  }

  async cargarUsuario() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const username = navigation.extras.state['usuario'];
      if (username) {
        this.usuario = await this._serviceUsuario.obtenerUsuarios().toPromise().then(
          usuarios => usuarios ? usuarios.find(u => u.username === username) : undefined
        );
      }
    }
  }

  async cargarProductos() {
    try {
      const productos = await this._serviceProducto.obtenerProductos().toPromise();
      this.productos = productos ? productos : [];
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  goToProfile() {
    // Navegar a la página de perfil del usuario
    console.log('Navegando al perfil del usuario...');
    this.router.navigate(['/perfil'], { state: { usuario: this.usuario } });
  }

  logout() {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
    // Aquí puedes agregar la lógica para limpiar datos del usuario o tokens de sesión
    this.router.navigate(['/login']);
  }

  escanear() {
    // Lógica para la funcionalidad de escanear
    console.log('Escaneando código QR...');
    // Aquí puedes agregar la integración con el plugin de la cámara o escáner QR
  }

  gestionarProductos() {
    // Navegar a la página de gestión de productos
    console.log('Navegando a la gestión de productos...');
    this.router.navigate(['/productos']);
  }

  gestionarLotes() {
    // Navegar a la página de gestión de lotes
    console.log('Navegando a la gestión de lotes...');
    this.router.navigate(['/lotes']);
  }

  verPedidos() {
    // Navegar a la página de pedidos
    console.log('Navegando a la página de pedidos...');
    this.router.navigate(['/pedidos']);
  }

  rastrearPedido() {
    // Lógica para rastrear el pedido con el código de seguimiento
    if (this.codigoSeguimiento) {
      console.log(`Rastreando pedido con código: ${this.codigoSeguimiento}`);
      // Agregar la navegación o lógica para mostrar el resultado del rastreo
      this.router.navigate(['/rastrear'], { state: { codigo: this.codigoSeguimiento } });
    } else {
      console.error('Por favor ingresa un código de seguimiento');
    }
  }

  gestionarUsuarios() {
    // Navegar a la página de gestión de usuarios
    console.log('Navegando a la gestión de usuarios...');
    this.router.navigate(['/usuarios']);
  }

  verReportes() {
    // Navegar a la página de reportes
    console.log('Navegando a la página de reportes...');
    this.router.navigate(['/reportes']);
  }
}
