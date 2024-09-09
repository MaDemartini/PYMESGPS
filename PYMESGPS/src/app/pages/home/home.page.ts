import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuario!: Usuario;

  constructor(private router: Router, private supabaseService: SupabaseService) {}

  ngOnInit() {
    const navigate = this.router.getCurrentNavigation();
    if (navigate?.extras.state) {
      this.usuario = navigate.extras.state['userInfo'];
    }
  }

  openMenu() {
    document.querySelector('ion-menu')?.open();
  }

  closeMenu() {
    document.querySelector('ion-menu')?.close();
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
    this.closeMenu();
  }

  async logout() {
    try {
      await this.supabaseService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
    this.closeMenu();
  }
}
