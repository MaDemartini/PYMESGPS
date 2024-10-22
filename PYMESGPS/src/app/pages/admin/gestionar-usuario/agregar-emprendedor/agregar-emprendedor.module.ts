import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarEmprendedorPageRoutingModule } from './agregar-emprendedor-routing.module';

import { AgregarEmprendedorPage } from './agregar-emprendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarEmprendedorPageRoutingModule
  ],
  declarations: [AgregarEmprendedorPage]
})
export class AgregarEmprendedorPageModule {}
