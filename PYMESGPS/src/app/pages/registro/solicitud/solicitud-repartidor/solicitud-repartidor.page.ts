import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrearRepartidorSolicitud } from 'src/app/models/Crear/Usuarios/crearRepartidorSolicitud';
import { Preferences } from '@capacitor/preferences';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';

@Component({
  selector: 'app-solicitud-repartidor',
  templateUrl: './solicitud-repartidor.page.html',
  styleUrls: ['./solicitud-repartidor.page.scss'],
})
export class SolicitudRepartidorPage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  id_emprendedor: number | undefined;  // ID del emprendedor que hará la solicitud
  id_estado_solicitud: number = 1;  // Estado inicial: 1 para "pendiente"

  constructor(
    private repartidorService: RepartidorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarEmprendedor();
  }

  // Cargar el ID del emprendedor logueado desde Preferences
  async cargarEmprendedor() {
    try {
      const { value } = await Preferences.get({ key: 'user-info' });
      if (value) {
        const emprendedor = JSON.parse(value);
        this.id_emprendedor = emprendedor?.id_emprendedor;

        if (!this.id_emprendedor) {
          console.error('El usuario no es un emprendedor o no tiene id_emprendedor.');
          this.router.navigate(['/login']);
        }
      } else {
        console.error('No se encontró información del emprendedor.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cargar los datos del emprendedor:', error);
      this.router.navigate(['/login']);
    }
  }

  async solicitarRepartidor() {
    if (!this.nombreCompleto || !this.correo || !this.username) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    if (!this.id_emprendedor) {
      console.error("No se pudo identificar al emprendedor.");
      return;
    }

    const nuevaSolicitud: CrearRepartidorSolicitud = {
      nombre_completo: this.nombreCompleto,
      correo: this.correo,
      username: this.username,
      id_emprendedor: this.id_emprendedor,
      id_estado_solicitud: this.id_estado_solicitud  // Usamos el valor numérico de la tabla (1 = pendiente)
    };

    try {
      await this.repartidorService.solicitarRepartidor(nuevaSolicitud).toPromise();
      console.info("Solicitud de repartidor enviada con éxito.");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante la solicitud de repartidor:', error);
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
