import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearEmprendedor } from 'src/app/models/Crear/Usuarios/crearEmprendedor';
import * as bcrypt from 'bcryptjs';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-emprendedor',
  templateUrl: './agregar-emprendedor.page.html',
  styleUrls: ['./agregar-emprendedor.page.scss'],
})
export class AgregarEmprendedorPage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  estado: boolean = true; 

  constructor(
    private emprendedorService: EmprendedorService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async agregarEmprendedor() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password) {
      this.mostrarMensaje('Por favor complete todos los campos', 'danger');
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      const nuevoEmprendedor: CrearEmprendedor = {
        nombre_completo: this.nombreCompleto,
        correo: this.correo,
        username: this.username,
        contrasena: hashedPassword,
        id_role: 2, // Rol de emprendedor
        estado: true,
      };

      await firstValueFrom(this.emprendedorService.registrarEmprendedor(nuevoEmprendedor));
      this.mostrarMensaje('Emprendedor agregado con éxito', 'success');
      this.router.navigate(['/gestionar-usuario']);
    } catch (error) {
      this.mostrarMensaje('Error al agregar el emprendedor', 'danger');
      console.error('Error al agregar emprendedor:', error);
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
