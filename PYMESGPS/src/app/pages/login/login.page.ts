import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Inicializamos el formulario de login con validaciones
    this.loginForm = this.fb.group({
      correo_us: ['', [Validators.required, Validators.email]],
      contrasena_us: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  // Función para manejar el inicio de sesión
  async onLogin() {
    if (this.loginForm.valid) {
      const { correo_us, contrasena_us } = this.loginForm.value;
      const usuarioValido = await this.supabaseService.validarUsuario(correo_us, contrasena_us);
      
      if (usuarioValido) {
        console.log('Usuario autenticado:', usuarioValido);
        // Redirige a la página correspondiente según el rol
        // Puedes redirigir al home u otra página dependiendo del rol
        if (usuarioValido.rol === 1) {
          this.router.navigate(['/home-admin']);
        } else if (usuarioValido.rol === 2) {
          this.router.navigate(['/home-emprendedor']);
        } else if (usuarioValido.rol === 3) {
          this.router.navigate(['/home-repartidor']);
        } else if (usuarioValido.rol === 4) {
          this.router.navigate(['/home-cliente']);
        }
      } else {
        console.error('Credenciales incorrectas');
        // Aquí podrías agregar una notificación de error en la interfaz
      }
    }
  }

  // Función para redirigir al registro de cliente
  irARegistroCliente() {
    this.router.navigate(['/registro-cliente']);
  }

  // Función para redirigir al registro de emprendedor
  irARegistroEmprendedor() {
    this.router.navigate(['/registro-emprendedor']);
  }
}
