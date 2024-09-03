import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceUsuarioService } from 'src/app/services/service-usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: ServiceUsuarioService,
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
  onLogin() {
    if (this.loginForm.valid) {
      const { correo_us, contrasena_us } = this.loginForm.value;
      const usuarioValido = this.usuarioService.validar_usuario(correo_us, contrasena_us);
      if (usuarioValido) {
        console.log('Usuario autenticado:', usuarioValido);
        // Redirige a la página correspondiente según el rol
        this.router.navigate(['/home']); // Ajusta esta ruta según la lógica de tu aplicación
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
