import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HistorialEntregaRepartidor } from 'src/app/models/historial_entrega_repartidor';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { HistorialEntregaRepartidorService } from 'src/app/services/historial-entrega-repartidor/historial-entrega-repartidor.service';

@Component({
  selector: 'app-historial-entregas',
  templateUrl: './historial-entregas.page.html',
  styleUrls: ['./historial-entregas.page.scss'],
})
export class HistorialEntregasPage implements OnInit {
  historialEntregas: (HistorialEntregaRepartidor & {
    solicitud: {
      cliente: { nombre_completo: string };
      lote: { nombre_lote: string };
      emprendedor: { nombre_completo: string };
      estado_solicitud: { nombre_estado: string };
    };
  })[] = [];

  idRepartidor: number | null = null;

  constructor(
    private authService: AuthServiceService,
    private historialEntregaRepartidorService: HistorialEntregaRepartidorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarHistorialEntregas();
  }

  async cargarHistorialEntregas() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario && usuario.id_repartidor) {
        this.idRepartidor = usuario.id_repartidor;
  
        if (this.idRepartidor !== null) {
          this.historialEntregas = await firstValueFrom(
            this.historialEntregaRepartidorService.obtenerHistorialPorRepartidor(this.idRepartidor)
          );
        } else {
          console.warn('El ID del repartidor es null.');
        }
      } else {
        console.warn('El usuario no tiene un ID de repartidor válido.');
      }
    } catch (error) {
      console.error('Error al cargar el historial de entregas:', error);
    }
  }
  

  volver() {
    this.router.navigate(['/home']);
  }
}
