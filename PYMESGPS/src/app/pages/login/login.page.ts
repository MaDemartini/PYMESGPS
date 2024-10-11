import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import * as bcrypt from "bcryptjs";
import { AutentificacionService } from 'src/app/services/autentificacion/autentificacion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  constructor(
    private _authService: AutentificacionService,
    private router: Router
  ) { }

  ngOnInit() {
    // Inicialización adicional si es necesaria
  }

  // Función de inicio de sesión para administrador
async loginAdmin(username: string, password: string) {
  // Verificar si el nombre de usuario es 'admin'
  if (username !== 'admin') {
    console.warn("Nombre de usuario incorrecto");
    return false;
  }

  // Obtener la información del usuario desde el almacenamiento
  const { value } = await Preferences.get({ key: 'user-info' });

    if (!value) {
      console.warn("No se encontró la información del usuario");
      return false;
    }

    const userInfo = JSON.parse(value);

    // Verificar la contraseña con bcrypt
    const passwordCorrect = await bcrypt.compare(password, userInfo.contraseña_us);

    if (passwordCorrect) {
      console.log("Inicio de sesión exitoso");
      return true;
    } else {
      console.warn("Contraseña incorrecta");
      return false;
    }
  }

  // Método para manejar el inicio de sesión
  async login() {
    if (this.username && this.password) {
      try {
        const usuarioExiste = await this._authService.autenticar(this.username, this.password).toPromise();

        if (usuarioExiste) {
          console.info("Usuario Existe");
          this.router.navigate(['dashboard'], {
            state: {
              usuario: this.username
            }
          });
        } else {
          console.error("Usuario No existe");
        }
      } catch (error) {
        console.error('Error durante la autenticación:', error);
      }
    } else {
      console.error("Debes ingresar el usuario y la contraseña");
    }
  }

  // Navegación a la página de registro para clientes
  irARegistroCliente() {
    this.router.navigate(['/registro'], { state: { rol: 4 } });
  }

  // Navegación a la página de registro para emprendedores
  irARegistroEmprendedor() {
    this.router.navigate(['/registro'], { state: { rol: 2 } });
  }
}
