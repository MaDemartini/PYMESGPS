import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {
  cliente: Cliente | undefined;
  codigoSeguimiento: string = '';

  constructor(
    private menuCtrl: MenuController,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarCliente() {
    const { value } = await Preferences.get({ key: 'user-info' });
    if (value) {
      this.cliente = JSON.parse(value);
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
}
