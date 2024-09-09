// perfil.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  async ngOnInit() {
    try {
      this.usuario = await this.supabaseService.obtenerUsuarioActual();
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    }
  }

  async logout() {
    try {
      await this.supabaseService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  }

  volver() {
    this.router.navigate(['/home']); 
  }
}
