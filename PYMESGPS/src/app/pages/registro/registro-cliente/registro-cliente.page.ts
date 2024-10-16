import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearCliente } from 'src/app/models/Crear/Usuarios/crearCliente';
import * as bcrypt from 'bcryptjs';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';

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
    private router: Router
  ) {}

  ngOnInit() {}

  async registrarCliente() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password || !this.direccion || !this.region || !this.comuna || !this.telefono) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    try {
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
        id_role: 1  // El rol de cliente es '1'
      };

      await this.clienteService.registrarCliente(nuevoCliente).toPromise();
      console.info("Cliente registrado con éxito.");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante el registro del cliente:', error);
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
