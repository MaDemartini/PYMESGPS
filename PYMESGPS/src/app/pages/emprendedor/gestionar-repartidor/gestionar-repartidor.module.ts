import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarRepartidorPageRoutingModule } from './gestionar-repartidor-routing.module';

import { GestionarRepartidorPage } from './gestionar-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarRepartidorPageRoutingModule
  ],
  declarations: [GestionarRepartidorPage]
})
export class GestionarRepartidorPageModule {}
