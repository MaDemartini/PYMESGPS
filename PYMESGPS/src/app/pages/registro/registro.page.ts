import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  registroForm: FormGroup;
  rol: number;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo_us: ['', [Validators.required, Validators.email]],
      contrasena_us: ['', Validators.required],
    });

    // Obtener el rol desde el estado de la navegación
    const navigation = this.router.getCurrentNavigation();
    this.rol = (navigation?.extras?.state as any)?.rol || 4; // Default to 4 (Cliente) if not provided
  }

  async onRegister() {
    if (this.registroForm.valid) {
      const usuario = {
        ...this.registroForm.value,
        fecha_creacion: new Date(),
      };

      const registrado = await this.supabaseService.registrarUsuario(usuario, this.rol);

      if (registrado) {
        this.router.navigate(['/login']);
      } else {
        console.error('Error al registrar usuario');
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  volver() {
    this.router.navigate(['/login']); // O la ruta que desees para volver
  }
}
