import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
})
export class RegistroClientePage implements OnInit {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      correo_us: ['', [Validators.required, Validators.email]],
      contrasena_us: ['', [Validators.required, Validators.minLength(6)]],
      nombre_completo: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async onRegister() {
    if (this.registroForm.valid) {
      const usuario = {
        ...this.registroForm.value,
        fecha_creacion: new Date(),
      };
      const registrado = await this.supabaseService.registrarUsuario(usuario, 'Cliente');
      if (registrado) {
        this.router.navigate(['/login']);
      } else {
        console.error('Error al registrar cliente');
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  volver() {
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }
  
}
