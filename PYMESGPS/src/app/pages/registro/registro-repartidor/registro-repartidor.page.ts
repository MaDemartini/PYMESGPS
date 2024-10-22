import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrearRepartidor } from 'src/app/models/Crear/Usuarios/crearRepartidor';
import * as bcrypt from 'bcryptjs';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
        id_role: 3  // El rol de repartidor es '3'
      };

      await this.repartidorService.registrarRepartidor(nuevoRepartidor).toPromise();
      console.info("Repartidor registrado con éxito.");
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante el registro del repartidor:', error);
    }
  }

  volver() {
    this.router.navigate(['/login']);
  }
}
