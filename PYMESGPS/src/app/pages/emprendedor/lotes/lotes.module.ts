import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LotesPageRoutingModule } from './lotes-routing.module';

import { LotesPage } from './lotes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LotesPageRoutingModule
  ],
  declarations: [LotesPage]
})
export class LotesPageModule {}
