import { Component, OnInit } from '@angular/core';
import { LoteService } from 'src/app/services/lote/lote.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { Lote } from 'src/app/models/lote';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-lotes-creados',
  templateUrl: './lotes-creados.page.html',
  styleUrls: ['./lotes-creados.page.scss'],
})
export class LotesCreadosPage implements OnInit {
  lotes: Lote[] = [];
  idEmprendedor: number | null = null;

  constructor(
    private loteService: LoteService,
    private authService: AuthServiceService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarEmprendedor();
    if (this.idEmprendedor) {
      await this.cargarLotes();
    }
  }

  // Método para cargar el ID del emprendedor logeado
  async cargarEmprendedor() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario && usuario.id_emprendedor) {
        this.idEmprendedor = usuario.id_emprendedor;
      } else {
        console.error('No se encontró un emprendedor logeado');
      }
    } catch (error) {
      this.mostrarMensaje('Error al cargar la información del emprendedor', 'danger');
    }
  }

  // Método para cargar los lotes del emprendedor
  async cargarLotes() {
    try {
      this.lotes = await firstValueFrom(this.loteService.obtenerLotesPorEmprendedor(this.idEmprendedor!));
    } catch (error) {
      this.mostrarMensaje('Error al cargar los lotes', 'danger');
      console.error('Error al cargar los lotes:', error);
    }
  }

  // Método para eliminar un lote
  async eliminarLote(idLote: number) {
    try {
      await firstValueFrom(this.loteService.eliminarLote(idLote));
      this.lotes = this.lotes.filter(lote => lote.id_lote !== idLote); // Actualizar la lista de lotes
      this.mostrarMensaje('Lote eliminado correctamente', 'success');
    } catch (error) {
      this.mostrarMensaje('Error al eliminar el lote', 'danger');
      console.error('Error al eliminar el lote:', error);
    }
  }

  // Método para mostrar mensajes en pantalla
  private async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top',
    });
    toast.present();
  }
}
