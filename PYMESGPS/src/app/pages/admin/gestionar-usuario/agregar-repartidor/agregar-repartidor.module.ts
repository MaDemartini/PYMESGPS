import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarRepartidorPageRoutingModule } from './agregar-repartidor-routing.module';

import { AgregarRepartidorPage } from './agregar-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarRepartidorPageRoutingModule
  ],
  declarations: [AgregarRepartidorPage]
})
export class AgregarRepartidorPageModule {}
