import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearRepartidor } from 'src/app/models/Crear/Usuarios/crearRepartidor';
import * as bcrypt from 'bcryptjs';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-repartidor',
  templateUrl: './agregar-repartidor.page.html',
  styleUrls: ['./agregar-repartidor.page.scss'],
})
export class AgregarRepartidorPage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  estado: boolean = true; 

  constructor(
    private repartidorService: RepartidorService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async agregarRepartidor() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password) {
      this.mostrarMensaje('Por favor complete todos los campos', 'danger');
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      const nuevoRepartidor: CrearRepartidor = {
        nombre_completo: this.nombreCompleto,
        correo: this.correo,
        username: this.username,
        contrasena: hashedPassword,
        id_role: 3,  // El rol de repartidor es '3'
        estado: true,
      };

      await firstValueFrom(this.repartidorService.registrarRepartidor(nuevoRepartidor));
      console.info("Repartidor agregado con éxito.");
      this.router.navigate(['/gestionar-usuario']);
    } catch (error) {
      console.error('Error al agregar repartidor:', error);
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
