import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuarios/usuario.service';
import { CrearUsuario } from 'src/app/models/Crear/crearUsuario';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  rol: number | undefined;

  constructor(
    private _serviceUsuario: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.rol = navigation.extras.state['rol'];
    }
  }

  async registrar() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password || this.rol === undefined) {
      console.error("Debe completar todos los campos.");
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      const nuevoUsuario: CrearUsuario = {
        nombre_completo: this.nombreCompleto,
        correo_us: this.correo,
        username: this.username,
        contraseña_us: hashedPassword,
        rol: {
          id_rol: this.rol, // Asegúrate de pasar un objeto completo con las propiedades necesarias
          nombre_rol: '', // Puedes asignar un nombre vacío o manejarlo como lo necesites
          descripcion_rol: '' // También puedes manejar esto según tu lógica de negocio
        }
      };

      await this._serviceUsuario.agregarNuevoUsuario(nuevoUsuario).toPromise();
      console.info("Usuario registrado con éxito");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante el registro del usuario:', error);
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
