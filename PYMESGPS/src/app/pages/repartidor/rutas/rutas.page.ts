import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { HistorialEntregaRepartidor } from 'src/app/models/historial_entrega_repartidor';
import { HistorialEntrega } from 'src/app/models/historial_entrega';
import { HistorialEntregaService } from 'src/app/services/historial-entrega/historial-entrega.service';
import { HistorialEntregaRepartidorService } from 'src/app/services/historial-entrega-repartidor/historial-entrega-repartidor.service';
import { EstadoSolicitudServicioService } from 'src/app/services/estado-solicitud-servicio/estado-solicitud-servicio.service';
import { ActualizarSolicitudServicio } from 'src/app/models/Actualizar/actualizarSolicitudServicio';
import { Notificacion } from 'src/app/models/notificacion';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { ApiConfigService } from 'src/app/services/apiconfig/apiconfig.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  repartidor: any;
  solicitudesPendientes: SolicitudServicio[] = [];
  solicitudesAprobadas: SolicitudServicio[] = [];
  solicitudesCompletadas: SolicitudServicio[] = [];
  solicitudesCanceladas: SolicitudServicio[] = [];
  clienteSeleccionado: any = null;

  constructor(
    private router: Router,
    private authService: AuthServiceService,
    private apiConfigService: ApiConfigService,
    private repartidorService: RepartidorService,
    private solicitudRepartidorService: SolicitudRepartidorService,
    private toastController: ToastController,
    private http: HttpClient,
    private historialEntregaService: HistorialEntregaService,
    private notificacionesService: NotificacionesService,
    private historialEntregaRepartidorService: HistorialEntregaRepartidorService,
    private estadoSolicitudServicioService: EstadoSolicitudServicioService
  ) { }

  async ngOnInit() {
    try {
      await this.cargarRepartidor();
      await this.cargarSolicitudes();
      await this.cargarDatosIniciales();
    } catch (error) {
      this.mostrarMensaje('Error al cargar datos iniciales.', 'danger');
    }
  }

  async cargarDatosIniciales(event?: any) {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario?.id_repartidor) {
        this.repartidor = await firstValueFrom(
          this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor)
        );
      }

      if (this.repartidor?.id_repartidor) {
        this.solicitudesPendientes = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            1 // Pendiente
          )
        );

        this.solicitudesAprobadas = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            2 // En Proceso
          )
        );

        this.solicitudesCompletadas = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            3 // Completada
          )
        );

        this.solicitudesCanceladas = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            4 // Cancelada
          )
        );
      }

      // Si se invocó desde el refresher, completar la acción
      if (event) {
        event.target.complete();
        this.mostrarMensaje('Datos actualizados correctamente.', 'success');
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      if (event) {
        event.target.complete();
      }
      this.mostrarMensaje('Error al actualizar los datos.', 'danger');
    }
  }

  private async cargarRepartidor() {
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (usuario?.id_repartidor) {
        this.repartidor = await firstValueFrom(
          this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor)
        );
      }
    } catch (error) {
      console.error('Error al cargar datos del repartidor:', error);
      throw error;
    }
  }

  private async cargarSolicitudes() {
    try {
      if (this.repartidor?.id_repartidor) {
        // Pendientes
        this.solicitudesPendientes = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            1 // Pendiente
          )
        );

        // En Proceso
        this.solicitudesAprobadas = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            2 // En Proceso
          )
        );

        // Completadas
        this.solicitudesCompletadas = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            3 // Completada
          )
        );

        // Canceladas
        this.solicitudesCanceladas = await firstValueFrom(
          this.solicitudRepartidorService.obtenerSolicitudesPorEstado(
            this.repartidor.id_repartidor,
            4 // Cancelada
          )
        );
      }
    } catch (error) {
      console.error('Error al cargar las solicitudes:', error);
      throw error;
    }
  }

  async empezarRuta(solicitud: SolicitudServicio) {
    if (!solicitud?.id_solicitud || !solicitud.cliente || !solicitud.lote || !solicitud.lote.id_lote) {
      this.mostrarMensaje('Solicitud inválida para iniciar ruta.', 'danger');
      return;
    }

    try {
      // Registrar en historial_entrega con estado "En Transito (2)"
      const historialEntrega: HistorialEntrega = {
        id_lote: solicitud.lote.id_lote,
        id_tipo_estado: 2, // Estado "En Transito"
        descripcion: 'Pedido en tránsito por el repartidor.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaService.agregarHistorial(historialEntrega));

      // Actualizar el estado de la solicitud
      const datosActualizar: ActualizarSolicitudServicio = { id_estado_solicitud: 2 }; // Estado "En Proceso"
      await firstValueFrom(
        this.estadoSolicitudServicioService.actualizarEstadoSolicitud(solicitud.id_solicitud, datosActualizar)
      );

      // Validar que el cliente tenga un ID válido
      if (!solicitud.cliente.id_cliente) {
        console.error('El cliente no tiene un ID válido.');
        this.mostrarMensaje('No se pudo enviar la notificación al cliente.', 'warning');
      } else {
        // Construir la notificación
        const notificacion: Notificacion = {
          id_usuario: solicitud.cliente.id_cliente, // Cliente como usuario
          id_role: 1, // Role del cliente
          titulo: 'Tu pedido está en camino',
          mensaje: `El repartidor ha iniciado la ruta de tu lote: ${solicitud.lote.nombre_lote}. Y tu pedido llegará durante el día.`,
          leido: false,
          fecha: new Date(),
        };

        // Enviar la notificación
        await firstValueFrom(
          this.solicitudRepartidorService.enviarNotificacionCliente(notificacion)
        );
      }

      // Navegar al mapa
      const direccionCompleta = `${solicitud.cliente.direccion ?? ''}`;
      this.router.navigate(['/mapa'], { state: { solicitud, direccionCompleta } });

      this.mostrarMensaje('Ruta iniciada correctamente.', 'success');
    } catch (error) {
      console.error('Error al iniciar la ruta:', error);
      this.mostrarMensaje('Error al iniciar la ruta.', 'danger');
    }
  }

  async seguirRuta(solicitud: SolicitudServicio) {
    if (!solicitud?.id_solicitud || !solicitud.cliente) {
      this.mostrarMensaje('Solicitud inválida para continuar la ruta.', 'danger');
      return;
    }

    try {
      // Navegar al mapa
      const direccionCompleta = `${solicitud.cliente.direccion ?? ''}`;
      this.router.navigate(['/mapa'], { state: { solicitud, direccionCompleta } });

      this.mostrarMensaje('Ruta continuada correctamente.', 'success');
    } catch (error) {
      console.error('Error al continuar la ruta:', error);
      this.mostrarMensaje('Error al continuar la ruta.', 'danger');
    }
  }


  async cancelarPedido(solicitud: SolicitudServicio) {
    try {
      if (!solicitud?.id_solicitud) {
        throw new Error('Falta el ID de la solicitud.');
      }

      if (!solicitud.lote || !solicitud.lote.id_lote) {
        throw new Error('Falta el ID del lote en la solicitud.');
      }

      if (!solicitud?.cliente?.id_cliente) {
        throw new Error('Falta el ID del cliente en la solicitud.');
      }

      const usuario = await this.authService.getDecryptedUserData();
      if (!usuario || usuario.id_role !== 3 || !usuario.id_repartidor) {
        console.error('El usuario actual no es un repartidor válido.');
        return;
      }
      const idRepartidor = usuario.id_repartidor;

      // Registrar en historial_entrega con estado "Detenido (3)"
      const historialEntrega: HistorialEntrega = {
        id_lote: solicitud.lote.id_lote,
        id_tipo_estado: 3, // Estado "Detenido"
        descripcion: 'Pedido detenido por el repartidor.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaService.agregarHistorial(historialEntrega));

      // Registrar en historial_entrega_repartidor
      const historialRepartidor: HistorialEntregaRepartidor = {
        id_solicitud: solicitud.id_solicitud,
        id_repartidor: idRepartidor,
        descripcion: 'Pedido ha sido cancelado por el repartidor.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaRepartidorService.agregarHistorial(historialRepartidor));

      // Actualizar estado en solicitud_servicio a "Cancelada (4)"
      const datosActualizar: ActualizarSolicitudServicio = { id_estado_solicitud: 4 };
      await firstValueFrom(
        this.estadoSolicitudServicioService.actualizarEstadoSolicitud(solicitud.id_solicitud, datosActualizar)
      );

      // Construir la notificación
      const notificacionCliente: Notificacion = {
        id_usuario: solicitud.cliente.id_cliente,
        id_role: 1, // Role del cliente
        titulo: 'Pedido Detenido',
        mensaje: `Tu pedido ha sido cancelado por el repartidor, este será devuelto a la bodega.`,
        leido: false,
        fecha: new Date(),
      };

      // Enviar la notificación
      await firstValueFrom(this.solicitudRepartidorService.enviarNotificacionCliente(notificacionCliente));

      console.log('Pedido cancelado. Notificación enviada al cliente.');
      alert('El pedido ha sido cancelado.');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al cancelar el pedido:', error.message);
      } else {
        console.error('Error al cancelar el pedido:', error);
      }
    }
  }

  async obtenerCoordenadasCliente(cliente: any): Promise<{ lat: number; lng: number } | null> {
    if (cliente.latitud && cliente.longitud) {
      return { lat: cliente.latitud, lng: cliente.longitud };
    }

    const direccionCompleta = `${cliente.direccion}, ${cliente.comuna}, ${cliente.region}`;
    try {
      const apiKey = this.apiConfigService.getHttpApiKey();
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionCompleta)}&key=${apiKey}`;
      const response: any = await firstValueFrom(this.http.get(url));
      if (response?.results?.length > 0) {
        return response.results[0].geometry.location;
      }
      console.warn('No se encontraron resultados para la dirección proporcionada.');
      return null;
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      return null;
    }
  }

  abrirEnGoogleMaps(direccion: string) {
    const encodedAddress = encodeURIComponent(direccion);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }

  async devolverPedido(solicitud: SolicitudServicio) {
    try {
      // Verificar que todos los datos requeridos existan
      if (!solicitud?.id_solicitud) {
        throw new Error('Falta el ID de la solicitud.');
      }

      if (!solicitud.lote || !solicitud.lote.id_lote) {
        throw new Error('Falta el ID del lote en la solicitud.');
      }

      if (!solicitud?.cliente?.id_cliente) {
        throw new Error('Falta el ID del cliente en la solicitud.');
      }

      const usuario = await this.authService.getDecryptedUserData();
      if (!usuario || usuario.id_role !== 3 || !usuario.id_repartidor) {
        console.error('El usuario actual no es un repartidor válido.');
        return;
      }
      const idRepartidor = usuario.id_repartidor;

      // Registrar en historial_entrega con estado "Devuelto (5)"
      const historialEntrega: HistorialEntrega = {
        id_lote: solicitud.lote.id_lote,
        id_tipo_estado: 5, // Estado "Devuelto"
        descripcion: 'El pedido ha sido devuelto al remitente',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaService.agregarHistorial(historialEntrega));

      // Registrar en historial_entrega_repartidor
      const historialRepartidor: HistorialEntregaRepartidor = {
        id_solicitud: solicitud.id_solicitud,
        id_repartidor: idRepartidor,
        descripcion: 'Entrega devuelta por el repartidor.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaRepartidorService.agregarHistorial(historialRepartidor));

      // Actualizar estado en solicitud_servicio a "Devuelto (5)"
      const datosActualizar: ActualizarSolicitudServicio = { id_estado_solicitud: 5 };
      await firstValueFrom(
        this.estadoSolicitudServicioService.actualizarEstadoSolicitud(solicitud.id_solicitud, datosActualizar)
      );

      // Construir la notificación
      const notificacion: Notificacion = {
        id_usuario: solicitud.cliente.id_cliente,
        id_role: 1, // Role del cliente
        titulo: 'Pedido Devuelto',
        mensaje: `Tu pedido ha sido devuelto a la bodega correctamente.`,
        leido: false,
        fecha: new Date(),
      };

      const notificacionRepartidor: Notificacion = {
        id_usuario: solicitud.id_repartidor,
        id_role: 3,
        titulo: 'Pedido Devuelto',
        mensaje: `Has devuelto el pedido "${solicitud.lote.nombre_lote}".`,
        leido: false,
        fecha: new Date(),
      }

      // Enviar la notificación
      await firstValueFrom(this.solicitudRepartidorService.enviarNotificacionCliente(notificacion));
      await firstValueFrom(this.notificacionesService.crearNotificacion(notificacionRepartidor));

      console.log('Pedido devuelto. Notificación enviada al cliente.');
      alert('El pedido ha sido devuelto correctamente.');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al devolver el pedido:', error.message);
      } else {
        console.error('Error al devolver el pedido:', error);
      }
    }
  }

  private async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top',
    });
    await toast.present();
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
