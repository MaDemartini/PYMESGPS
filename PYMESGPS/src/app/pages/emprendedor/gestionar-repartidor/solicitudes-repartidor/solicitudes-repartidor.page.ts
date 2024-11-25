import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { CrearSolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/crearSolicitud-repartidor';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes-repartidor',
  templateUrl: './solicitudes-repartidor.page.html',
  styleUrls: ['./solicitudes-repartidor.page.scss'],
})
export class SolicitudesRepartidorPage implements OnInit {
  id_emprendedor: number | undefined;
  nombre_completo: string = '';
  correo: string = '';
  username: string = '';

  constructor(
    private solicitudRepartidorService: SolicitudRepartidorService,
    private authService: AuthServiceService,
    private router: Router,
    private toastController: ToastController,
  ) { }

  async ngOnInit() {
    await this.cargarEmprendedor();
  }

  // Cargar la información del emprendedor
  async cargarEmprendedor() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario && usuario.id_emprendedor) {
        this.id_emprendedor = usuario.id_emprendedor;
      } else {
        console.error('No se encontró información del emprendedor.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario', error);
    }
  }

  // Crear una nueva solicitud de repartidor
  crearSolicitudRepartidor() {
    if (this.id_emprendedor && this.nombre_completo && this.correo && this.username) {
      this.mostrarMensaje('Todos los campos son obligatorios.', 'danger');
      const nuevaSolicitud: CrearSolicitudRepartidor = {
        id_emprendedor: this.id_emprendedor,
        nombre_completo: this.nombre_completo,
        correo: this.correo,
        username: this.username,
        id_estado_solicitud: 1 // Asignamos el ID del estado (Pendiente)
        ,
      };

      this.solicitudRepartidorService.crearSolicitudRepartidor(nuevaSolicitud).subscribe({
        next: () => {
          this.mostrarMensaje('Solicitud enviada con éxito.', 'success');
          this.router.navigate(['/gestionar-repartidor']);
        },
        error: (error) => {
          console.error('Error al crear la solicitud de repartidor', error);
        }
      });
    } else {
      console.error('Faltan datos para crear la solicitud.');
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
    this.router.navigate(['/gestionar-repartidor']);
  }
}


