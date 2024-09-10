import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-welcome-modal',            //El nombre que se usará en el HTML para incluir este componente
  templateUrl: './welcome-modal.component.html',       //El archivo HTML que define la vista (el contenido visual) del componente.
  styleUrls: ['./welcome-modal.component.scss'],      //Archivo(s) de estilo asociados con el componente
})
export class WelcomeModalComponent implements OnInit {
  @Input() nombre: string = '';            //utiliza el decorador @Input para declarar una propiedad llamada nombre

  constructor(private modalController: ModalController) {}

  ngOnInit() {}   //se utiliza para ejecutar lógica cuando el componente se inicializa

  close() {
    this.modalController.dismiss();
  }
}
