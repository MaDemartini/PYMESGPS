import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { lastValueFrom } from 'rxjs';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  repartidor: boolean = false;  // Para verificar si es repartidor
  emprendedor: boolean = false;  // Para verificar si es emprendedor
  repartidorData: any;  // Para almacenar los datos del repartidor
  emprendedorData: any;  // Para almacenar los datos del emprendedor

  constructor(
    private menuCtrl: MenuController,
    private repartidorService: RepartidorService,
    private emprendedorService: EmprendedorService,
    private router: Router,
    private authService: AuthServiceService // Inyectar el AuthService para recuperar los datos
  ) {}

  ngOnInit() {
    this.cargarUsuario();  // Cargar los datos del usuario al iniciar la página
    this.menuCtrl.enable(true);  // Asegúrate de habilitar el menú cuando la página se carga
  }

  // Abrir menú
  openMenu() {
    this.menuCtrl.open();
  }

  // Cerrar menú
  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarUsuario() {
    const usuario = await this.authService.getDecryptedUserData();  // Obtener datos desencriptados
    //console.log('Datos del usuario obtenidos en HomePage:', usuario);  // Verificar usuario
  
    if (usuario) {
      if (usuario.id_repartidor) {
        this.repartidor = true;
        this.repartidorData = await lastValueFrom(this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor));
        //console.log('Datos del repartidor en HomePage:', this.repartidorData);  // Verificar repartidorData
      } else {
        this.repartidor = false;
        this.repartidorData = null;
      }
  
      if (usuario.id_emprendedor) {
        this.emprendedor = true;
        this.emprendedorData = await lastValueFrom(this.emprendedorService.obtenerEmprendedorPorId(usuario.id_emprendedor));
        //console.log('Datos del emprendedor en HomePage:', this.emprendedorData);  // Verificar emprendedorData
      } else {
        this.emprendedor = false;
        this.emprendedorData = null;
      }
    } else {
      this.repartidor = false;
      this.emprendedor = false;
      this.repartidorData = null;
      this.emprendedorData = null;
    }
  }


  // Navegar al perfil
  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  // Cerrar sesión
  logout() {
    this.router.navigate(['/login']);
  }

  // Escanear código QR (funcionalidad futura)
  escanear() {
    console.log('Escanear código QR...');
  }

  // Navegar a la página de gestión de productos
  gestionarProductos() {
    this.router.navigate(['/productos']);
  }

  // Navegar a la página de gestión de lotes
  gestionarLotes() {
    this.router.navigate(['/lotes']);
  }

  // Navegar a la página de pedidos
  verPedidos() {
    this.router.navigate(['/pedidos']);
  }

  verRutas() {
    this.router.navigate(['/rutas']);
  }

  verHistorialEntregas(){
    this.router.navigate(['/historial-entregas']);
  }

  gestionarRepartidores() {
    this.router.navigate(['/gestionar-repartidor']);
  }

  goToConfig() {
    this.router.navigate(['/configuracion']);
  }
  
  goToSupport() {
    this.router.navigate(['/soporte']);
  }
  
}
