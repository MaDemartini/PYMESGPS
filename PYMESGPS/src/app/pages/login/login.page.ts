import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo_us: ['', [Validators.required, Validators.email]],
      contrasena_us: ['', Validators.required],
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const { correo_us, contrasena_us } = this.loginForm.value;

      const usuario = await this.supabaseService.validarUsuario(correo_us, contrasena_us);

      if (usuario) {
        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/home']);
      } else {
        console.error('Error al iniciar sesión');
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  irARegistroCliente() {
    this.router.navigate(['/registro'], { state: { rol: 4 } });
  }

  irARegistroEmprendedor() {
    this.router.navigate(['/registro'], { state: { rol: 2 } });
  }
}
