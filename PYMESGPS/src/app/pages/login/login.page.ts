import { Component, OnInit } from '@angular/core'; // Decorador de componente.
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Módulos para manejo de formularios.
import { Router } from '@angular/router'; // Servicio de navegación entre rutas.
import { SupabaseService } from 'src/app/services/supabase.service'; // Servicio que gestiona la comunicación con Supabase.

@Component({
  selector: 'app-login', // Selector del componente.
  templateUrl: './login.page.html', // Ruta a la plantilla HTML.
  styleUrls: ['./login.page.scss'], // Ruta al archivo de estilos.
})
export class LoginPage {
  loginForm: FormGroup; // Definición del formulario de login.

  constructor(
    private fb: FormBuilder, // FormBuilder para gestionar los formularios reactivos.
    private supabaseService: SupabaseService, // Inyección del servicio de Supabase para interactuar con la base de datos.
    private router: Router // Inyección del servicio Router para manejar la navegación.
  ) {
    // Definición y validación del formulario.
    this.loginForm = this.fb.group({
      correo_us: ['', [Validators.required, Validators.email]], // Campo de email con validaciones.
      contrasena_us: ['', Validators.required], // Campo de contraseña con validación requerida.
    });
  }

  // Método para iniciar sesión.
  async onLogin() {
    if (this.loginForm.valid) {
      const { correo_us, contrasena_us } = this.loginForm.value;

      const usuario = await this.supabaseService.validarUsuario(correo_us, contrasena_us); // Verificar las credenciales.

      if (usuario) {
        // Si las credenciales son correctas, redirige a la página de inicio.
        this.router.navigate(['/home']);
      } else {
        console.error('Error al iniciar sesión'); // Error en caso de credenciales incorrectas.
      }
    } else {
      console.error('Formulario no válido'); // Error si el formulario no pasa las validaciones.
    }
  }

  // Navegación a la página de registro para clientes.
  irARegistroCliente() {
    this.router.navigate(['/registro'], { state: { rol: 4 } }); // Redirige a la página de registro con el rol de cliente (rol = 4).
  }

  // Navegación a la página de registro para emprendedores.
  irARegistroEmprendedor() {
    this.router.navigate(['/registro'], { state: { rol: 2 } }); // Redirige a la página de registro con el rol de emprendedor (rol = 2).
  }
}
