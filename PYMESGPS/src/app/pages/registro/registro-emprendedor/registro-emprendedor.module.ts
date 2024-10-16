import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroEmprendedorPageRoutingModule } from './registro-emprendedor-routing.module';

import { RegistroEmprendedorPage } from './registro-emprendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroEmprendedorPageRoutingModule
  ],
  declarations: [RegistroEmprendedorPage]
})
export class RegistroEmprendedorPageModule {}
