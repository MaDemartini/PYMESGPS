import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Admin } from 'src/app/models/Usuarios/admin';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  admin: boolean = false;
  adminData: any;


  constructor(
    private menuCtrl: MenuController,
    private adminService: AdminService,
    private authService: AuthServiceService,  // Usamos AuthService para la autenticación
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarAdmin();
    this.menuCtrl.enable(true);  // Asegúrate de habilitar el menú cuando la página se carga
  }

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  async cargarAdmin() {
    const usuario = await this.authService.getDecryptedUserData();
    if (usuario && usuario.id_admin) {
      this.admin = true;
      const adminInfo = await lastValueFrom(this.adminService.obtenerAdminPorId(usuario.id_admin));

      this.adminData = Array.isArray(adminInfo) ? adminInfo[0] : adminInfo;

    } else {
      this.admin = false;
      this.adminData = null;
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

  goToConfig() {
    this.router.navigate(['/configuracion']);
  }

  goToSupport() {
    this.router.navigate(['/soporte']);
  }
  
  verSolicitudesEmprendedorReparto() {
    this.router.navigate(['/solicitudes-emprendedores-reparto']);
  }  

}
