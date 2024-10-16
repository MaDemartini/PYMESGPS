import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  repartidor: any; // Para manejar datos de repartidor
  emprendedor: any; // Para manejar datos de emprendedor

  constructor(
    private menuCtrl: MenuController,
    private repartidorService: RepartidorService,
    private emprendedorService: EmprendedorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarUsuario() {
    const { value } = await Preferences.get({ key: 'user-info' });
    if (value) {
      const usuario = JSON.parse(value);

      // Verificar el tipo de usuario
      if (usuario.id_repartidor) {
        this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor).subscribe(
          (data) => {
            this.repartidor = data;
          },
          (error) => {
            console.error('Error al cargar repartidor:', error);
          }
        );
      }

      if (usuario.id_emprendedor) {
        this.emprendedorService.obtenerEmprendedorPorId(usuario.id_emprendedor).subscribe(
          (data) => {
            this.emprendedor = data;
          },
          (error) => {
            console.error('Error al cargar emprendedor:', error);
          }
        );
      }
    }
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  escanear() {
    console.log('Escanear código QR...');
  }

  gestionarProductos() {
    this.router.navigate(['/productos']);
  }

  gestionarLotes() {
    this.router.navigate(['/lotes']);
  }

  verPedidos() {
    this.router.navigate(['/pedidos']);
  }
}
