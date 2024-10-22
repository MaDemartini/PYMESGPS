import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesRepartidorPageRoutingModule } from './solicitudes-repartidor-routing.module';

import { SolicitudesRepartidorPage } from './solicitudes-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesRepartidorPageRoutingModule
  ],
  declarations: [SolicitudesRepartidorPage]
})
export class SolicitudesRepartidorPageModule {}
