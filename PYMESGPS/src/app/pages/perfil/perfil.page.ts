import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  emprendedor: any;
  cliente: any;
  repartidor: any;
  admin: any;

  constructor(
    private clienteService: ClienteService,
    private repartidorService: RepartidorService,
    private emprendedorService: EmprendedorService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPerfilUsuario();
  }

  async cargarPerfilUsuario() {
    const { value } = await Preferences.get({ key: 'user-info' });
    if (value) {
      const usuario = JSON.parse(value);

      if (usuario.id_cliente) {
        this.clienteService.obtenerClientePorId(usuario.id_cliente).subscribe((data) => {
          this.cliente = data;
        });
      } else if (usuario.id_emprendedor) {
        this.emprendedorService.obtenerEmprendedorPorId(usuario.id_emprendedor).subscribe((data) => {
          this.emprendedor = data;
        });
      } else if (usuario.id_repartidor) {
        this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor).subscribe((data) => {
          this.repartidor = data;
        });
      } else if (usuario.id_admin) {
        this.adminService.obtenerAdminPorId(usuario.id_admin).subscribe((data) => {
          this.admin = data;
        });
      }
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
