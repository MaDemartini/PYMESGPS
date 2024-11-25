import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearCliente } from 'src/app/models/Crear/Usuarios/crearCliente';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { ApiConfigService } from 'src/app/services/apiconfig/apiconfig.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
})
export class RegistroClientePage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  direccion: string = '';
  region: string = '';
  comuna: string = '';
  telefono: string = '';

  constructor(
    private clienteService: ClienteService,
    private apiConfigService: ApiConfigService,
    private router: Router
  ) {}

  ngOnInit() {}

  async registrarCliente() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password || !this.direccion || !this.region || !this.comuna || !this.telefono) {
      console.error("Todos los campos son obligatorios.");
      return;
    }
  
    try {
      const direccionCompleta = `${this.direccion}, ${this.comuna}, ${this.region}`;
      const coordenadas = await this.obtenerCoordenadas(direccionCompleta);
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
  
      const nuevoCliente: CrearCliente = {
        nombre_completo: this.nombreCompleto,
        correo: this.correo,
        username: this.username,
        contrasena: hashedPassword,
        direccion: this.direccion,
        region: this.region,
        comuna: this.comuna,
        telefono: this.telefono,
        latitud: coordenadas.lat,
        longitud: coordenadas.lng,
        id_role: 1,
      };
  
      await lastValueFrom(this.clienteService.registrarCliente(nuevoCliente));
      console.info("Cliente registrado con éxito.");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante el registro del cliente:', error);
    }
  }
  
  private async obtenerCoordenadas(direccion: string): Promise<{ lat: number; lng: number }> {
    try {
      const mapsApiKey = this.apiConfigService.getMapsApiKey(); 

      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        direccion
      )}&key=${mapsApiKey}`;
  
      const response = await fetch(geocodingUrl);
      if (!response.ok) {
        throw new Error(`Error en la API de geocodificación: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
      } else {
        throw new Error('No se pudieron obtener las coordenadas para la dirección proporcionada.');
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      throw error;
    }
  }
  
  
  volver() {
    this.router.navigate(['/login']);
  }
}
