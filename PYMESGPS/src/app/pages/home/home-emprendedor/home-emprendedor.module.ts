import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeEmprendedorPageRoutingModule } from './home-emprendedor-routing.module';

import { HomeEmprendedorPage } from './home-emprendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeEmprendedorPageRoutingModule
  ],
  declarations: [HomeEmprendedorPage]
})
export class HomeEmprendedorPageModule {}
