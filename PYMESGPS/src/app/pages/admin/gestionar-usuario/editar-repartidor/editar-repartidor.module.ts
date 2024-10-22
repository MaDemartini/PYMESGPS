import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarRepartidorPageRoutingModule } from './editar-repartidor-routing.module';

import { EditarRepartidorPage } from './editar-repartidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarRepartidorPageRoutingModule
  ],
  declarations: [EditarRepartidorPage]
})
export class EditarRepartidorPageModule {}
