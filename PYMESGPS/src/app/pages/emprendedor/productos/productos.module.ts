import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Asegúrate de importar ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { ProductosPageRoutingModule } from './productos-routing.module';

import { ProductosPage } from './productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Importa ReactiveFormsModule
    IonicModule,
    ProductosPageRoutingModule
  ],
  declarations: [ProductosPage]
})
export class ProductosPageModule {}
