import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarLotePageRoutingModule } from './gestionar-lote-routing.module';

import { GestionarLotePage } from './gestionar-lote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarLotePageRoutingModule
  ],
  declarations: [GestionarLotePage]
})
export class GestionarLotePageModule {}
