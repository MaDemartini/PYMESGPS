import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { Preferences } from '@capacitor/preferences';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private clienteService: ClienteService,
    private emprendedorService: EmprendedorService,
    private repartidorService: RepartidorService,
    private adminService: AdminService,
    private router: Router,
    private authService: AuthServiceService 
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.username || !this.password) {
      console.error('Nombre de usuario y contraseña son obligatorios.');
      return;
    }

    try {
      let persona: any;

      const [clientes, emprendedores, repartidores, admins] = await Promise.all([
        this.clienteService.obtenerClientePorUsername(this.username).toPromise(),
        this.emprendedorService.obtenerEmprendedorPorUsername(this.username).toPromise(),
        this.repartidorService.obtenerRepartidorPorUsername(this.username).toPromise(),
        this.adminService.obtenerAdminPorUsername(this.username).toPromise(),
      ]);

      if (clientes?.length) {
        persona = clientes[0];
      } else if (emprendedores?.length) {
        persona = emprendedores[0];
      } else if (repartidores?.length) {
        persona = repartidores[0];
      } else if (admins?.length) {
        persona = admins[0];
      } else {
        console.error('Usuario no encontrado.');
        return;
      }

      const isPasswordCorrect = await bcrypt.compare(this.password, persona.contrasena);

      if (!isPasswordCorrect) {
        console.error('Contraseña incorrecta.');
        return;
      }

      // Guardar la información del usuario en Preferences usando el authService
      await this.authService.setEncryptedUserData(persona);

      // Redirigir según el tipo de usuario
      const esAdmin = await this.adminService.esAdmin(persona.id_admin).toPromise();
      const esCliente = await this.clienteService.esCliente(persona.id_cliente).toPromise();
      const esEmprendedor = await this.emprendedorService.esEmprendedor(persona.id_emprendedor).toPromise();
      const esRepartidor = await this.repartidorService.esRepartidor(persona.id_repartidor).toPromise();

      if (esAdmin) {
        this.router.navigate(['/home-admin']);
      } else if (esCliente) {
        this.router.navigate(['/home-cliente']);
      } else if (esEmprendedor || esRepartidor) {
        this.router.navigate(['/home']);
      }

      console.info('Inicio de sesión exitoso.');
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
    }
  }

  irARegistroCliente() {
    this.router.navigate(['/registro-cliente']);
  }

  irARegistroEmprendedor() {
    this.router.navigate(['/registro-emprendedor']);
  }
}
