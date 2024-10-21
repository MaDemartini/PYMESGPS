import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { lastValueFrom } from 'rxjs';
import { SolicitudRepartidor } from 'src/app/models/Usuarios/Solicitud/solicitud-repartidor'; // Cambié a SolicitudRepartidor
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';

@Component({
  selector: 'app-gestionar-repartidor',
  templateUrl: './gestionar-repartidor.page.html',
  styleUrls: ['./gestionar-repartidor.page.scss'],
})
export class GestionarRepartidorPage implements OnInit {
  repartidores: any[] = [];
  solicitudesPendientes: SolicitudRepartidor[] = [];  
  solicitudesAprobadas: SolicitudRepartidor[] = [];   
  solicitudesRechazadas: SolicitudRepartidor[] = [];  
  id_emprendedor: number | undefined;

  constructor(
    private router: Router,
    private solicitudRepartidorService: SolicitudRepartidorService,
    private authService: AuthServiceService
  ) {}

  async ngOnInit() {
    await this.cargarEmprendedor();
    this.cargarSolicitudes();
  }

  async cargarEmprendedor() {
    try {
      const usuario = await this.authService.getDecryptedUserData();  
      if (usuario && usuario.id_emprendedor) {
        this.id_emprendedor = usuario.id_emprendedor;
      } else {
        console.error('No se pudo cargar la información del emprendedor.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario', error);
    }
  }

  async cargarSolicitudes() {
    if (this.id_emprendedor) {
      try {
        const solicitudes = await lastValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesEmprendedor(this.id_emprendedor)
        );
  
        // Filtrar las solicitudes por estado
        this.solicitudesPendientes = solicitudes.filter(sol => sol.id_estado_solicitud === 1);
        this.solicitudesAprobadas = solicitudes.filter(sol => sol.id_estado_solicitud === 2 && !sol.registrado);
        this.solicitudesRechazadas = solicitudes.filter(sol => sol.id_estado_solicitud === 3);
        this.repartidores = solicitudes.filter(sol => sol.registrado); // Aquí cargamos los repartidores activos
  
        //console.log('Solicitudes cargadas:', solicitudes); 
      } catch (error) {
        console.error('Error al cargar solicitudes', error);
      }
    }
  }
  
  // Método para enviar una solicitud
  solicitarRepartidor() {
    this.router.navigate(['/solicitudes-repartidor']);
  }

  // Verificar si el emprendedor tiene repartidores disponibles
  tieneRepartidores() {
    return this.repartidores.length < 2;
  }

  volver() {
    this.router.navigate(['/home']); 
  }

  // Método para registrar repartidor aprobado y pasar los datos
  registrarRepartidor(id_solicitud: number) {
    const solicitud = this.solicitudesAprobadas.find(sol => sol.id_solicitud === id_solicitud);
    
    if (solicitud) {
      // Navega y pasa los datos necesarios
      this.router.navigate(['/registro-repartidor'], {
        queryParams: {
          id_solicitud: solicitud.id_solicitud,
          nombre_completo: solicitud.nombre_completo,
          correo: solicitud.correo,
          username: solicitud.username
        }
      });
  
      // Marca la solicitud como registrada
      this.solicitudRepartidorService.marcarComoRegistrado(id_solicitud).subscribe(() => {
        //console.log('Solicitud marcada como registrada');
      });
    } else {
      console.error('Solicitud no encontrada');
    }
  }
  
}
