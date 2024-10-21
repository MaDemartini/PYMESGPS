import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {
  cliente: boolean = false; // Para verificar si es cliente
  clienteData: any;  // Para almacenar los datos del cliente
  codigoSeguimiento: string = ''; // Para el código de seguimiento

  constructor(
    private menuCtrl: MenuController,
    private clienteService: ClienteService,
    private authService: AuthServiceService,  // Usamos AuthService para la autenticación
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCliente();  // Cargar la información del cliente al iniciar la página
    this.menuCtrl.enable(true);  // Asegúrate de habilitar el menú cuando la página se carga
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarCliente() {
    const usuario = await this.authService.getDecryptedUserData();  // Obtener datos desencriptados del usuario
    if (usuario && usuario.id_cliente) {
      this.cliente = true;  // Verificar si es cliente
      const clienteInfo = await lastValueFrom(this.clienteService.obtenerClientePorId(usuario.id_cliente));
      
      // Asegurarse de que clienteInfo no sea un array
      this.clienteData = Array.isArray(clienteInfo) ? clienteInfo[0] : clienteInfo;
      //console.log('Datos del cliente:', this.clienteData);
    } else {
      this.cliente = false;  // No es cliente
      this.clienteData = null; // Limpiar los datos del cliente
    }
  }

  rastrearPedido() {
    if (this.codigoSeguimiento) {
      console.log(`Rastreando pedido con código: ${this.codigoSeguimiento}`);
      this.router.navigate(['/rastrear'], { state: { codigo: this.codigoSeguimiento } });
    } else {
      console.error('Por favor ingresa un código de seguimiento');
    }
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  goToConfig() {
    this.router.navigate(['/configuracion']);
  }

  goToSupport() {
    this.router.navigate(['/soporte']);
  }
  
}
