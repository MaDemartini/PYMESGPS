/// <reference types="google.maps" />
import { Capacitor } from '@capacitor/core';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { HistorialEntregaService } from 'src/app/services/historial-entrega/historial-entrega.service';
import { HistorialEntregaRepartidorService } from 'src/app/services/historial-entrega-repartidor/historial-entrega-repartidor.service';
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';
import { ApiConfigService } from 'src/app/services/apiconfig/apiconfig.service';
import { HttpClient } from '@angular/common/http';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { HistorialEntrega } from 'src/app/models/historial_entrega';
import { HistorialEntregaRepartidor } from 'src/app/models/historial_entrega_repartidor';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { EstadoSolicitudServicioService } from 'src/app/services/estado-solicitud-servicio/estado-solicitud-servicio.service';
import { Notificacion } from 'src/app/models/notificacion';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map!: GoogleMap;
  repartidorLatLng: { lat: number; lng: number } | undefined;
  repartidorMarkerId: string | undefined;
  pedidos: any[] = [];
  clienteSeleccionado: any = null;

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private historialEntregaService: HistorialEntregaService,
    private estadoSolicitudServicioService: EstadoSolicitudServicioService,
    private historialEntregaRepartidorService: HistorialEntregaRepartidorService,
    private solicitudRepartidorService: SolicitudRepartidorService,
    private authService: AuthServiceService,
    private apiConfigService: ApiConfigService,
    private http: HttpClient,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    try {
      // Verificar si la plataforma es web
      if (Capacitor.getPlatform() === 'web') {
        console.warn('La geolocalización no está implementada en el navegador. Usando coordenadas de prueba.');

        // Usar coordenadas de prueba en el navegador
        this.repartidorLatLng = { lat: -33.4489, lng: -70.6693 }; // Ejemplo: Santiago, Chile
        console.log('Coordenadas de prueba:', this.repartidorLatLng);
      } else {
        // Solicitar permisos de geolocalización
        await this.solicitarPermisos();

        // Obtener ubicación inicial del repartidor
        await this.obtenerUbicacionRepartidor();
      }

      // Cargar pedidos con clientes y lotes desde la base de datos
      this.pedidos = await this.obtenerSolicitudesConClientesYLotes();

      if (this.pedidos.length > 0) {
        const cliente = this.pedidos[0].cliente;
        let clienteLatLng: { lat: number; lng: number } | null = {
          lat: cliente.latitud,
          lng: cliente.longitud,
        };

        if (!clienteLatLng.lat || !clienteLatLng.lng) {
          const direccionCompleta = `${cliente.direccion}, ${cliente.comuna}, ${cliente.region}`;
          clienteLatLng = await this.obtenerCoordenadasDireccion(direccionCompleta);

          if (!clienteLatLng) {
            console.error('No se pudieron obtener las coordenadas del cliente.');
            return;
          }
        }

        console.log('Coordenadas del cliente:', clienteLatLng);

        // Cargar el mapa con los datos del cliente
        await this.loadMap(clienteLatLng);

        // Observar ubicación del repartidor en tiempo real
        this.startWatchingPosition();
      } else {
        console.warn('No hay pedidos disponibles para mostrar.');
      }
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
    }
  }

  async solicitarPermisos() {
    const permission = await Geolocation.requestPermissions();
    if (permission.location !== 'granted') {
      throw new Error('Permisos de ubicación no concedidos.');
    }
  }

  async obtenerSolicitudesConClientesYLotes() {
    try {
      const solicitudes = await firstValueFrom(
        this.clienteService.obtenerSolicitudesConClientesYLotes()
      );
      console.log('Solicitudes obtenidas:', solicitudes);
      return solicitudes;
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      return [];
    }
  }

  async obtenerUbicacionRepartidor() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      this.repartidorLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log('Ubicación inicial del repartidor:', this.repartidorLatLng);
    } catch (error) {
      console.error('Error al obtener la ubicación del repartidor:', error);

      // Verifica si el error tiene la propiedad "code"
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const geolocationError = error as { code: number; message?: string };
        if (geolocationError.code === 3) {
          alert('No se pudo obtener la ubicación. Intenta nuevamente.');
        }
      } else {
        alert('Ocurrió un error desconocido al obtener la ubicación.');
      }
    }
  }

  async obtenerCoordenadasDireccion(direccion: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = this.apiConfigService.getMapsApiKey();
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${apiKey}`;
      const response: any = await firstValueFrom(this.http.get(url));
      if (response?.results?.length > 0) {
        const location = response.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      console.warn('No se encontraron resultados para la dirección proporcionada.');
      return null;
    } catch (error) {
      console.error('Error al obtener coordenadas:', error);
      return null;
    }
  }

  async loadMap(clienteLatLng: { lat: number; lng: number }) {
    this.map = await GoogleMap.create({
      id: 'map',
      element: this.mapElement.nativeElement,
      apiKey: this.apiConfigService.getMapsApiKey(),
      config: {
        center: clienteLatLng,
        zoom: 15,
      },
    });

    const markerPedidoMap = new Map<string, any>();

    for (const pedido of this.pedidos) {
      const clienteLatLng = {
        lat: pedido.cliente.latitud,
        lng: pedido.cliente.longitud,
      };

      const markerId = await this.map.addMarker({
        coordinate: clienteLatLng,
        title: `Pedido ${pedido.id_solicitud}`,
        snippet: pedido.cliente.direccion,
        iconUrl: 'https://cdn-icons-png.flaticon.com/128/16993/16993997.png',
        iconSize: { width: 40, height: 40 },
      });

      markerPedidoMap.set(markerId, pedido);
    }

    this.map.setOnMarkerClickListener(async (marker) => {
      const pedidoSeleccionado = markerPedidoMap.get(marker.markerId);
      if (pedidoSeleccionado) {
        this.clienteSeleccionado = pedidoSeleccionado;
        document.querySelector('.pedido-card')?.classList.add('visible');
      }
    });

    this.map.setOnMapClickListener(() => {
      this.ocultarCard();
    });
  }

  // Método para ocultar la card
  ocultarCard() {
    this.clienteSeleccionado = null;
    document.querySelector('.pedido-card')?.classList.remove('visible');
  }

  startWatchingPosition() {
    Geolocation.watchPosition({}, async (position, err) => {
      if (err) {
        console.error('Error al observar posición:', err);
        return;
      }

      if (position) {
        this.repartidorLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (this.repartidorMarkerId) {
          await this.map.removeMarker(this.repartidorMarkerId);
        }
        this.repartidorMarkerId = await this.map.addMarker({
          coordinate: this.repartidorLatLng!,
          title: 'Repartidor (Ubicación Actual)',
          snippet: 'Esta es tu ubicación actual',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/5328/5328070.png',
          iconSize: { width: 40, height: 40 }, // Tamaño fijo
        });
      }
    });
  }

  llamarTelefono(telefono: string) {
    window.open(`tel:${telefono}`, '_system');
  }

  abrirEnGoogleMaps(direccion: string) {
    const encodedAddress = encodeURIComponent(direccion);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }

  async entregarPedido(solicitud: SolicitudServicio) {
    if (!solicitud?.id_solicitud || !solicitud.lote?.id_lote || !solicitud.cliente?.id_cliente) {
      console.error('Solicitud inválida para entregar pedido.', solicitud);
      return;
    }
    console.log(solicitud);
    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (!usuario || usuario.id_role !== 3 || !usuario.id_repartidor) {
        console.error('El usuario actual no es un repartidor válido.');
        return;
      }
      const idRepartidor = usuario.id_repartidor;
  
      // Registrar en historial_entrega con estado "Entregado (3)"
      const historialEntrega: HistorialEntrega = {
        id_lote: solicitud.lote.id_lote,
        id_tipo_estado: 3, // Estado "Entregado"
        descripcion: 'Pedido entregado exitosamente.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaService.agregarHistorial(historialEntrega));
  
      // Registrar en historial_entrega_repartidor
      const historialRepartidor: HistorialEntregaRepartidor = {
        id_solicitud: solicitud.id_solicitud,
        id_repartidor: idRepartidor,
        descripcion: 'Entrega finalizada por el repartidor.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaRepartidorService.agregarHistorial(historialRepartidor));
  
      // Actualizar estado en solicitud_servicio a "Completada (3)"
      await firstValueFrom(
        this.estadoSolicitudServicioService.actualizarEstadoSolicitud(solicitud.id_solicitud, { id_estado_solicitud: 3 })
      );
  
      // Construir la notificación
      const notificacion: Notificacion = {
        id_usuario: solicitud.cliente.id_cliente,
        id_role: 1,
        titulo: 'Tu pedido llegó',
        mensaje: `Tu pedido ha sido entregado exitosamente (${solicitud.cliente.direccion ?? ''}).`,
        leido: false,
        fecha: new Date(),
      };
  
      // Enviar notificación al cliente
      await firstValueFrom(this.solicitudRepartidorService.enviarNotificacionCliente(notificacion));
  
      // Mostrar un mensaje visual de "Pedido Entregado"
      await this.mostrarMensaje('Pedido entregado exitosamente.', 'success');
  
      // Agregar una breve pausa antes de redirigir
      setTimeout(() => {
        this.router.navigate(['/rutas']);
      }, 2000); // 2 segundos de pausa para mostrar el mensaje
    } catch (error) {
      console.error('Error al completar la entrega:', error);
      this.mostrarMensaje('Error al completar la entrega.', 'danger');
    }
  }  

  async centrarMapaEnRepartidor() {
    if (!this.repartidorLatLng) {
      console.warn('La ubicación del repartidor no está disponible.');
      return;
    }

    try {
      await this.map.setCamera({
        coordinate: this.repartidorLatLng,
        zoom: 15,
      });
      console.log('Mapa centrado en la ubicación del repartidor.');
    } catch (error) {
      console.error('Error al centrar el mapa en el repartidor:', error);
    }
  }

  private async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
