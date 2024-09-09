import { Component } from '@angular/core'; // Importa el decorador de componente.
import { Router } from '@angular/router'; // Servicio para la navegación entre rutas.
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Módulos para formularios reactivos.
import { SupabaseService } from 'src/app/services/supabase.service'; // Servicio de Supabase.

@Component({
  selector: 'app-registro', // Selector del componente.
  templateUrl: './registro.page.html', // Ruta al template HTML del componente.
  styleUrls: ['./registro.page.scss'], // Estilos específicos del componente.
})
export class RegistroPage {
  registroForm: FormGroup; // Grupo de formulario reactivo.
  rol: number; // Variable para almacenar el rol del usuario.

  constructor(
    private fb: FormBuilder, // Inyección de dependencia para construir formularios.
    private supabaseService: SupabaseService, // Servicio para interactuar con Supabase.
    private router: Router // Servicio para manejar la navegación.
  ) {
    this.registroForm = this.fb.group({
      nombre_completo: ['', Validators.required], // Campo obligatorio para el nombre.
      correo_us: ['', [Validators.required, Validators.email]], // Campo obligatorio para el correo, con validación de email.
      contrasena_us: ['', Validators.required], // Campo obligatorio para la contraseña.
    });

    // Obtener el rol desde el estado de la navegación
    const navigation = this.router.getCurrentNavigation(); // Obtiene la navegación actual.
    this.rol = (navigation?.extras?.state as any)?.rol || 4; // Default a rol 4 (Cliente) si no se proporciona otro.
  }

  async onRegister() {
    if (this.registroForm.valid) { // Verifica si el formulario es válido.
      const usuario = {
        ...this.registroForm.value,
        fecha_creacion: new Date(), // Asigna la fecha de creación actual al usuario.
      };

      const registrado = await this.supabaseService.registrarUsuario(usuario, this.rol); // Llama al servicio para registrar al usuario.

      if (registrado) {
        this.router.navigate(['/login']); // Redirige al login si el registro fue exitoso.
      } else {
        console.error('Error al registrar usuario'); // Muestra error si el registro falla.
      }
    } else {
      console.error('Formulario no válido'); // Muestra error si el formulario no es válido.
    }
  }

  volver() {
    this.router.navigate(['/login']); // Navega de vuelta al login o ruta deseada.
  }
}
