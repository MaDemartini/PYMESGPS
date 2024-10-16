import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Admin } from 'src/app/models/Usuarios/admin';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  admin: Admin | undefined;

  constructor(
    private menuCtrl: MenuController,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarAdmin();
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarAdmin() {
    const { value } = await Preferences.get({ key: 'user-info' });
    if (value) {
      this.admin = JSON.parse(value);
    }
  }

  gestionarUsuarios() {
    this.router.navigate(['/usuarios']);
  }

  verReportes() {
    this.router.navigate(['/reportes']);
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
