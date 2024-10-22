import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarEmprendedorPageRoutingModule } from './editar-emprendedor-routing.module';

import { EditarEmprendedorPage } from './editar-emprendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarEmprendedorPageRoutingModule
  ],
  declarations: [EditarEmprendedorPage]
})
export class EditarEmprendedorPageModule {}
