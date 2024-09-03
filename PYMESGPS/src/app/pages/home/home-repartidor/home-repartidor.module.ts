import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeRepartidorPageRoutingModule } from './home-repartidor-routing.module';

import { HomeRepartidorPage } from './home-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRepartidorPageRoutingModule
  ],
  declarations: [HomeRepartidorPage]
})
export class HomeRepartidorPageModule {}
