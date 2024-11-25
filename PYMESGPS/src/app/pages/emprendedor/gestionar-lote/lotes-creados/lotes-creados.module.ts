import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LotesCreadosPageRoutingModule } from './lotes-creados-routing.module';

import { LotesCreadosPage } from './lotes-creados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LotesCreadosPageRoutingModule
  ],
  declarations: [LotesCreadosPage]
})
export class LotesCreadosPageModule {}
