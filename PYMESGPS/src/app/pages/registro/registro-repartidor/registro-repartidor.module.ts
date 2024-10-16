import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegistroRepartidorPageRoutingModule } from './registro-repartidor-routing.module';
import { RegistroRepartidorPage } from './registro-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroRepartidorPageRoutingModule
  ],
  declarations: [RegistroRepartidorPage] 
})
export class RegistroRepartidorPageModule {}
