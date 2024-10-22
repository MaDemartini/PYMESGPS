import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearCliente } from 'src/app/models/Crear/Usuarios/crearCliente';
import * as bcrypt from 'bcryptjs';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.page.html',
  styleUrls: ['./agregar-cliente.page.scss'],
})
export class AgregarClientePage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  direccion: string = '';
  region: string = '';
  comuna: string = '';
  telefono: string = '';

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async agregarCliente() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password || !this.direccion || !this.region || !this.comuna || !this.telefono) {
      this.mostrarMensaje('Por favor complete todos los campos', 'danger');
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      const nuevoCliente: CrearCliente = {
        nombre_completo: this.nombreCompleto,
        correo: this.correo,
        username: this.username,
        contrasena: hashedPassword,
        direccion: this.direccion,
        region: this.region,
        comuna: this.comuna,
        telefono: this.telefono,
        id_role: 1
      };

      await firstValueFrom(this.clienteService.registrarCliente(nuevoCliente));
      this.mostrarMensaje('Cliente agregado con éxito', 'success');
      this.router.navigate(['/gestionar-usuario']);
    } catch (error) {
      this.mostrarMensaje('Error al agregar el cliente', 'danger');
      console.error('Error al agregar cliente:', error);
    }
  }

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

  volver() {
    this.router.navigate(['/gestionar-usuario']);
  }
}
