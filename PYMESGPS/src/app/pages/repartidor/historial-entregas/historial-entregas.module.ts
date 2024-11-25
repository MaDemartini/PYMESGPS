import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialEntregasPageRoutingModule } from './historial-entregas-routing.module';

import { HistorialEntregasPage } from './historial-entregas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialEntregasPageRoutingModule
  ],
  declarations: [HistorialEntregasPage]
})
export class HistorialEntregasPageModule {}
