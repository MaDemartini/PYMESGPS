import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudRepartidorPageRoutingModule } from './solicitud-repartidor-routing.module';

import { SolicitudRepartidorPage } from './solicitud-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudRepartidorPageRoutingModule
  ],
  declarations: [SolicitudRepartidorPage]
})
export class SolicitudRepartidorPageModule {}
