import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { ServiceUsuarioService } from 'src/app/services/service-usuario.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
})
export class RegistroClientePage implements OnInit {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: ServiceUsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      correo_us: ['', [Validators.required, Validators.email]],
      contrasena_us: ['', [Validators.required, Validators.minLength(6)]],
      nombre_completo: ['', Validators.required],
      rol: ['Cliente'] // Se define el rol por defecto como 'Cliente'
    });
  }

  ngOnInit() {}

  onRegister() {
    if (this.registroForm.valid) {
      const nuevoUsuario: Usuario = {
        ...this.registroForm.value,
        id_usuario: Date.now(), // Genera un ID único
        fecha_creacion: new Date()
      };
      this.usuarioService.registrarUsuario(nuevoUsuario);
      this.router.navigate(['/login']); // Redirige al login después del registro
    } else {
      console.error('Formulario no válido');
    }
  }

  volver() {
    this.router.navigate(['/login']); // Redirige al usuario a la página de login
  }
}
