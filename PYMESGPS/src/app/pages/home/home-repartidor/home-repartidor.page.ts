import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-repartidor',
  templateUrl: './home-repartidor.page.html',
  styleUrls: ['./home-repartidor.page.scss'],
})
export class HomeRepartidorPage implements OnInit {

  constructor() {}

  ngOnInit() {}

  iniciarRuta() {
    console.log('Iniciando ruta...');
    // Lógica para escanear el código QR y comenzar la ruta
    // Puedes usar un plugin de escaneo de QR de Ionic Native o una API web
  }
}
