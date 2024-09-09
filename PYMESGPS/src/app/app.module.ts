import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule aquí

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeModalComponent } from './components/welcome-modal/welcome-modal.component'; // Importa tu componente

@NgModule({
  declarations: [
    AppComponent,
    WelcomeModalComponent  // Declara tu componente aquí
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,  
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Añade el esquema para permitir componentes personalizados
})
export class AppModule {}
