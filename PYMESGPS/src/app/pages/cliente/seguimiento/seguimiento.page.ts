import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.page.html',
  styleUrls: ['./seguimiento.page.scss'],
})
export class SeguimientoPage implements OnInit {
  codigoSeguimiento: string = '';
  lote: any | null = null;
  error: string | null = null;

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.codigoSeguimiento = navigation.extras.state['lote']?.codigo_seguimiento || '';
      this.lote = navigation.extras.state['lote'] || null;
    }
  }

  async ngOnInit() {
    if (this.codigoSeguimiento) {
      await this.buscarLote();
    } else {
      this.error = 'No se proporcionó un código de seguimiento.';
      this.mostrarMensaje(this.error, 'danger');
    }
  }

  /**
   * Busca los detalles del lote con el código de seguimiento.
   */
  async buscarLote(event?: any) {
    try {
      if (!this.lote) {
        this.error = 'No se encontraron detalles del lote.';
      } else {
        this.error = null;
      }

      if (event) {
        event.target.complete(); 
      }

    } catch (error) {
      console.error('Error al buscar los detalles del lote:', error);
    }
  }


  /**
   * Muestra un mensaje Toast en la pantalla.
   */
  private async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  /**
   * Redirige a la página anterior (Home Cliente).
   */
  volver() {
    this.router.navigate(['/home-cliente']);
  }
}
