import { Component, OnInit } from '@angular/core'; // Importa los decoradores para el componente.
import { Router } from '@angular/router'; // Servicio para la navegación.
import { SupabaseService } from 'src/app/services/supabase.service'; // Servicio de Supabase.

@Component({
  selector: 'app-perfil', // Selector del componente.
  templateUrl: './perfil.page.html', // Ruta al archivo HTML del perfil.
  styleUrls: ['./perfil.page.scss'], // Ruta al archivo de estilos.
})
export class PerfilPage implements OnInit {
  usuario: any; // Variable para almacenar los datos del usuario actual.

  constructor(private supabaseService: SupabaseService, private router: Router) {} // Inyección de dependencias.

  async ngOnInit() {
    try {
      this.usuario = await this.supabaseService.obtenerUsuarioActual(); // Carga los datos del usuario al iniciar el componente.
    } catch (error) {
      console.error('Error al cargar el perfil:', error); // Muestra error si falla la carga del perfil.
    }
  }

  async logout() {
    try {
      await this.supabaseService.logout(); // Llama al servicio para cerrar sesión.
      this.router.navigate(['/login']); // Navega a la página de login tras cerrar sesión.
    } catch (error) {
      console.error('Error al cerrar sesión', error); // Muestra error si falla el cierre de sesión.
    }
  }

  volver() {
    this.router.navigate(['/home']); // Navega de vuelta a la página principal.
  }
}
