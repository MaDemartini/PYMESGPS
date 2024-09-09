import { Component, OnInit } from '@angular/core'; // Decorador para definir el componente.
import { Router } from '@angular/router'; // Servicio para manejar la navegación.
import { SupabaseService } from 'src/app/services/supabase.service'; // Servicio para interactuar con Supabase.
import { Usuario } from 'src/app/models/usuario'; // Importa el modelo de Usuario.

@Component({
  selector: 'app-home', // Selector del componente.
  templateUrl: './home.page.html', // Ruta a la plantilla HTML.
  styleUrls: ['./home.page.scss'], // Ruta al archivo de estilos.
})
export class HomePage implements OnInit {
  usuario!: Usuario; // Variable para almacenar la información del usuario.

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit() {
    // Obtener la información del usuario desde la navegación.
    const navigate = this.router.getCurrentNavigation();
    if (navigate?.extras.state) {
      this.usuario = navigate.extras.state['userInfo']; // Extrae la información del usuario.
    }
  }

  // Función para abrir el menú lateral.
  openMenu() {
    document.querySelector('ion-menu')?.open(); // Abre el menú de Ionic.
  }

  // Función para cerrar el menú lateral.
  closeMenu() {
    document.querySelector('ion-menu')?.close(); // Cierra el menú de Ionic.
  }

  // Navega a la página del perfil del usuario.
  goToProfile() {
    this.router.navigate(['/perfil']); // Redirige a la página de perfil.
    this.closeMenu(); // Cierra el menú tras la redirección.
  }

  // Función para cerrar la sesión del usuario.
  async logout() {
    try {
      await this.supabaseService.logout(); // Cierra sesión usando el servicio Supabase.
      this.router.navigate(['/login']); // Redirige al login.
    } catch (error) {
      console.error('Error al cerrar sesión', error); // Muestra el error en caso de fallo.
    }
    this.closeMenu(); // Cierra el menú tras cerrar sesión.
  }
}
