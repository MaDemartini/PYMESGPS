import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroEmprendedorPageRoutingModule } from './registro-emprendedor-routing.module';

import { RegistroEmprendedorPage } from './registro-emprendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    RegistroEmprendedorPageRoutingModule
  ],
  declarations: [RegistroEmprendedorPage]
})
export class RegistroEmprendedorPageModule {}
