import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleLotePageRoutingModule } from './detalle-lote-routing.module';

import { DetalleLotePage } from './detalle-lote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleLotePageRoutingModule
  ],
  declarations: [DetalleLotePage]
})
export class DetalleLotePageModule {}
