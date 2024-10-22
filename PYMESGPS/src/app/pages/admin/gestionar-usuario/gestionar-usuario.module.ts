import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarUsuarioPageRoutingModule } from './gestionar-usuario-routing.module';

import { GestionarUsuarioPage } from './gestionar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarUsuarioPageRoutingModule
  ],
  declarations: [GestionarUsuarioPage]
})
export class GestionarUsuarioPageModule {}
