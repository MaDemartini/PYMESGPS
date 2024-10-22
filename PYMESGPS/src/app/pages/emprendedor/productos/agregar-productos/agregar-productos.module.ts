import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarProductosPageRoutingModule } from './agregar-productos-routing.module';

import { AgregarProductosPage } from './agregar-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    AgregarProductosPageRoutingModule
  ],
  declarations: [AgregarProductosPage]
})
export class AgregarProductosPageModule {}
