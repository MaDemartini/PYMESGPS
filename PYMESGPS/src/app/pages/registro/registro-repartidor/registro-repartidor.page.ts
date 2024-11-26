import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrearRepartidor } from 'src/app/models/Crear/Usuarios/crearRepartidor';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';

@Component({
  selector: 'app-registro-repartidor',
  templateUrl: './registro-repartidor.page.html',
  styleUrls: ['./registro-repartidor.page.scss'],
})
export class RegistroRepartidorPage implements OnInit {
  nombreCompleto: string = '';
  correo: string = '';
  username: string = '';
  password: string = '';
  id_solicitud: number | undefined;

  constructor(
    private repartidorService: RepartidorService,
    private solicitudRepartidorService: SolicitudRepartidorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Recibir los parámetros desde la página anterior
    this.route.queryParams.subscribe(params => {
      this.id_solicitud = params['id_solicitud'];
      this.nombreCompleto = params['nombre_completo'] || '';
      this.correo = params['correo'] || '';
      this.username = params['username'] || '';
    });
  }

  async registrarRepartidor() {
    if (!this.nombreCompleto || !this.correo || !this.username || !this.password) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      const nuevoRepartidor: CrearRepartidor = {
        nombre_completo: this.nombreCompleto,
        correo: this.correo,
        username: this.username,
        contrasena: hashedPassword,
        id_role: 3,// El rol de repartidor es '3'
        estado: true
      };

      // Register the new delivery person (using lastValueFrom for completion signal)
      await lastValueFrom(this.repartidorService.registrarRepartidor(nuevoRepartidor));
      console.info("Repartidor registrado con éxito.");

      // Mark the request as registered in the database
      if (this.id_solicitud) {
        await firstValueFrom(this.solicitudRepartidorService.marcarComoRegistrado(this.id_solicitud));
        console.info("Solicitud marcada como registrada.");
      }

      // Navegar a la página de gestión de repartidores
      this.router.navigate(['/gestionar-repartidor']);
    } catch (error) {
      console.error('Error durante el registro del repartidor:', error);
    }
  }

  volver() {
    this.router.navigate(['/gestionar-repartidor']);
  }
}
