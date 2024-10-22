import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EliminarProductosPageRoutingModule } from './eliminar-productos-routing.module';

import { EliminarProductosPage } from './eliminar-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    EliminarProductosPageRoutingModule
  ],
  declarations: [EliminarProductosPage]
})
export class EliminarProductosPageModule {}
