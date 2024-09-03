import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WelcomeModalComponent } from 'src/app/components/welcome-modal/welcome-modal.component';

@Component({
  selector: 'app-home-emprendedor',
  templateUrl: './home-emprendedor.page.html',
  styleUrls: ['./home-emprendedor.page.scss'],
})
export class HomeEmprendedorPage implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.presentWelcomeModal();
  }

  async presentWelcomeModal() {
    const modal = await this.modalController.create({
      component: WelcomeModalComponent,
      componentProps: { nombre: 'Nombre del Emprendedor' }
    });
    return await modal.present();
  }

  navigateTo(page: string) {
    console.log('Navegando a:', page);
    // Lógica para navegar entre las opciones (home, productos, etc.)

    
  }
}
