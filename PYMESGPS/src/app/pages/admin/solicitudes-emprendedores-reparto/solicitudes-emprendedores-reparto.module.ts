import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesEmprendedoresRepartoPageRoutingModule } from './solicitudes-emprendedores-reparto-routing.module';

import { SolicitudesEmprendedoresRepartoPage } from './solicitudes-emprendedores-reparto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesEmprendedoresRepartoPageRoutingModule
  ],
  declarations: [SolicitudesEmprendedoresRepartoPage]
})
export class SolicitudesEmprendedoresRepartoPageModule {}
