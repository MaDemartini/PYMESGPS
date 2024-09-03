import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WelcomeModalComponent } from 'src/app/components/welcome-modal/welcome-modal.component';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.page.html',
  styleUrls: ['./home-cliente.page.scss'],
})
export class HomeClientePage implements OnInit {
  codigoSeguimiento: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.presentWelcomeModal();
  }

  async presentWelcomeModal() {
    const modal = await this.modalController.create({
      component: WelcomeModalComponent,
      componentProps: { nombre: 'Nombre del Cliente' }
    });
    return await modal.present();
  }

  buscarLote() {
    if (this.codigoSeguimiento) {
      console.log('Buscando lote con código:', this.codigoSeguimiento);
    
      // Lógica para buscar lote usando el código de seguimiento


    } else {
      console.error('Código de seguimiento vacío');
    }
  }
}
