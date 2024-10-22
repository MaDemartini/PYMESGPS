import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { Repartidor } from 'src/app/models/Usuarios/repartidor';
import { firstValueFrom } from 'rxjs';
import { ActualizarRepartidor } from 'src/app/models/Actualizar/Usuarios/actualizarRepartidor';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-repartidor',
  templateUrl: './editar-repartidor.page.html',
  styleUrls: ['./editar-repartidor.page.scss'],
})
export class EditarRepartidorPage implements OnInit {
  repartidor: Repartidor = {} as Repartidor;

  constructor(
    private repartidorService: RepartidorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const idRepartidor = Number(this.route.snapshot.paramMap.get('id'));
    await this.cargarRepartidor(idRepartidor);
  }

  async cargarRepartidor(id: number) {
    try {
      this.repartidor = await firstValueFrom(this.repartidorService.obtenerRepartidorPorId(id));
    } catch (error) {
      this.mostrarMensaje('Error al cargar el repartidor', 'danger');
      console.error('Error al cargar el repartidor:', error);
    }
  }

  async editarRepartidor() {
    try {
      const repartidorActualizado: Partial<ActualizarRepartidor> = {
        ...this.repartidor,
        id_role: this.repartidor.id_role.id_role  // Convertir a número
      };
  
      await firstValueFrom(this.repartidorService.actualizarRepartidor(this.repartidor.id_repartidor, repartidorActualizado));
      this.mostrarMensaje('Repartidor actualizado con éxito', 'success');
      this.router.navigate(['/gestionar-usuario']);
    } catch (error) {
      this.mostrarMensaje('Error al actualizar el repartidor', 'danger');
      console.error('Error al actualizar el repartidor:', error);
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
