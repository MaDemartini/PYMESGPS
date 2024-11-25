import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
import { Preferences } from '@capacitor/preferences';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';  // Importa el ToastController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  passwordType: string = 'password';  // Controla el tipo de input para la contraseña
  passwordIcon: string = 'eye-off';   // Controla el icono de mostrar/ocultar

  constructor(
    private clienteService: ClienteService,
    private emprendedorService: EmprendedorService,
    private repartidorService: RepartidorService,
    private adminService: AdminService,
    private router: Router,
    private authService: AuthServiceService,
    private toastController: ToastController  // Inyecta el ToastController
  ) {}

  ngOnInit() {}

  // Lógica para cambiar el tipo de input de la contraseña
  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordType === 'password' ? 'eye-off' : 'eye';
  }

  async login() {
    if (!this.username || !this.password) {
      this.mostrarMensaje('Nombre de usuario y contraseña son obligatorios.', 'danger');
      return;
    }
  
    try {
      let usuario: any;
  
      const [clientes, emprendedores, repartidores, admins] = await Promise.all([
        firstValueFrom(this.clienteService.obtenerClientePorUsername(this.username)),
        firstValueFrom(this.emprendedorService.obtenerEmprendedorPorUsername(this.username)),
        firstValueFrom(this.repartidorService.obtenerRepartidorPorUsername(this.username)),
        firstValueFrom(this.adminService.obtenerAdminPorUsername(this.username)),
      ]);
  
      if (clientes?.length) {
        usuario = clientes[0];
      } else if (emprendedores?.length) {
        usuario = emprendedores[0];
      } else if (repartidores?.length) {
        usuario = repartidores[0];
      } else if (admins?.length) {
        usuario = admins[0];
      } else {
        this.mostrarMensaje('Usuario no encontrado.', 'danger');
        return;
      }
  
      const isPasswordCorrect = await bcrypt.compare(this.password, usuario.contrasena);
  
      if (!isPasswordCorrect) {
        this.mostrarMensaje('Contraseña incorrecta.', 'danger');
        return;
      }
  
      // Guardar la información del usuario
      await this.authService.setEncryptedUserData(usuario);
  
      // Guardar token de sesión
      const sessionToken = {
        access_token: 'simulated-token', // Reemplázalo con un token válido si lo generas
      };
      await this.authService.setSessionToken(sessionToken);
  
      // Verificar y redirigir según el tipo de usuario
      const esAdmin = usuario.id_admin ? await firstValueFrom(this.adminService.esAdmin(usuario.id_admin)) : false;
      const esCliente = usuario.id_cliente ? await firstValueFrom(this.clienteService.esCliente(usuario.id_cliente)) : false;
      const esEmprendedor = usuario.id_emprendedor ? await firstValueFrom(this.emprendedorService.esEmprendedor(usuario.id_emprendedor)) : false;
      const esRepartidor = usuario.id_repartidor ? await firstValueFrom(this.repartidorService.esRepartidor(usuario.id_repartidor)) : false;
  
      if (esAdmin) {
        this.router.navigate(['/home-admin']);
      } else if (esCliente) {
        this.router.navigate(['/home-cliente']);
      } else if (esEmprendedor || esRepartidor) {
        this.router.navigate(['/home']);
      }
  
      this.mostrarMensaje('Inicio de sesión exitoso.');
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      this.mostrarMensaje('Error durante el inicio de sesión. Inténtalo de nuevo.', 'danger');
    }
  }
  

  irARegistroCliente() {
    this.router.navigate(['/registro-cliente']);
  }

  irARegistroEmprendedor() {
    this.router.navigate(['/registro-emprendedor']);
  }

  irAContexto() {
    this.router.navigate(['/contexto']);
  }

  // Método para mostrar mensajes con Toast
  private async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: color === 'danger' ? 'warning' : 'checkmark-circle',
        }
      ]
    });
    toast.present();
  }
}
