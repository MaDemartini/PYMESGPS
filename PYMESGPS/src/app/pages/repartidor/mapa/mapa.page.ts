/// <reference types="google.maps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { ApiConfigService } from 'src/app/services/apiconfig/apiconfig.service';
import { ToastController } from '@ionic/angular';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { HistorialEntrega } from 'src/app/models/historial_entrega';
import { HistorialEntregaRepartidor } from 'src/app/models/historial_entrega_repartidor';
import { Notificacion } from 'src/app/models/notificacion';
import { EstadoSolicitudServicioService } from 'src/app/services/estado-solicitud-servicio/estado-solicitud-servicio.service';
import { HistorialEntregaRepartidorService } from 'src/app/services/historial-entrega-repartidor/historial-entrega-repartidor.service';
import { HistorialEntregaService } from 'src/app/services/historial-entrega/historial-entrega.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { SolicitudRepartidorService } from 'src/app/services/solicitud-repartidor/solicitud-repartidor.service';
import { HttpClient } from '@angular/common/http';

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
  ) {}

  async ngOnInit() {
    try {
      await this.inicializarMapa();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
      this.mostrarMensaje('Error al cargar el mapa.', 'danger');
    }
  }

  /**
   * Inicializa el mapa y configura los permisos.
   */
  async inicializarMapa() {
    try {
      await this.solicitarPermisos();

      this.repartidorLatLng = await this.obtenerUbicacionRepartidor();
      if (!this.repartidorLatLng) {
        this.mostrarMensaje('No se pudo obtener tu ubicación.', 'danger');
        return;
      }

      this.pedidos = await this.obtenerSolicitudesConClientesYLotes();
      if (this.pedidos.length === 0) {
        this.mostrarMensaje('No hay pedidos disponibles.', 'warning');
        return;
      }

      const clienteLatLng = await this.obtenerCoordenadasCliente(this.pedidos[0]?.cliente);
      await this.loadMap(clienteLatLng || this.repartidorLatLng);
      this.startWatchingPosition();
    } catch (error) {
      console.error('Error al inicializar el mapa:', error);
      this.mostrarMensaje('Error al inicializar el mapa.', 'danger');
    }
  }

async solicitarPermisos() {
  const permission = await Geolocation.requestPermissions();
  console.log('Permisos de ubicación:', permission);
  if (permission.location !== 'granted') {
    throw new Error('Permisos de ubicación no concedidos.');
  }
}

  async obtenerUbicacionRepartidor(): Promise<{ lat: number; lng: number } | undefined> {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      return { lat: position.coords.latitude, lng: position.coords.longitude };
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      return undefined;
    }
  }

  async obtenerSolicitudesConClientesYLotes() {
    try {
      const solicitudes = await firstValueFrom(this.clienteService.obtenerSolicitudesConClientesYLotes());
      return solicitudes || [];
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      return [];
    }
  }

  async obtenerCoordenadasCliente(cliente: any): Promise<{ lat: number; lng: number } | null> {
    if (cliente.latitud && cliente.longitud) {
      return { lat: cliente.latitud, lng: cliente.longitud };
    }

    const direccionCompleta = `${cliente.direccion}, ${cliente.comuna}, ${cliente.region}`;
    try {
      const apiKey = this.apiConfigService.getHttpApiKey();
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        direccionCompleta
      )}&key=${apiKey}`;
      const response: any = await firstValueFrom(this.http.get(url));
      if (response?.results?.length > 0) {
        return response.results[0].geometry.location;
      }
      console.warn('No se encontraron resultados para la dirección proporcionada.');
      return null;
    } catch (error) {
      console.error('Error al obtener coordenadas del cliente:', error);
      return null;
    }
  }

  async loadMap(center: { lat: number; lng: number }) {
    console.log('Inicializando mapa en:', center);
    if (!this.mapElement.nativeElement) {
      console.error('El contenedor del mapa no está disponible.');
      return;
    }
  
    this.map = await GoogleMap.create({
      id: 'map',
      element: this.mapElement.nativeElement,
      apiKey: this.apiConfigService.getMapaAndroidApiKey(),
      config: {
        center,
        zoom: 15,
        androidLiteMode: false,
      },
    });
  
    console.log('Mapa creado:', this.map);
    await this.agregarMarcadores();
  }
  

  async agregarMarcadores() {
    const markerPedidoMap = new Map<string, any>();

    for (const pedido of this.pedidos) {
      const clienteLatLng = {
        lat: pedido.cliente.latitud || 0,
        lng: pedido.cliente.longitud || 0,
      };

      if (clienteLatLng.lat && clienteLatLng.lng) {
        const markerId = await this.map.addMarker({
          coordinate: clienteLatLng,
          title: `Pedido ${pedido.id_solicitud}`,
          snippet: pedido.cliente.direccion || 'Sin dirección',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/16993/16993997.png',
        });
        markerPedidoMap.set(markerId, pedido);
      }
    }

    this.map.setOnMarkerClickListener((marker) => {
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

  ocultarCard() {
    this.clienteSeleccionado = null;
    document.querySelector('.pedido-card')?.classList.remove('visible');
  }

  async centrarMapaEnRepartidor() {
    if (!this.repartidorLatLng) {
      this.mostrarMensaje('No se pudo centrar el mapa.', 'warning');
      return;
    }

    await this.map.setCamera({ coordinate: this.repartidorLatLng, zoom: 15 });
  }

  startWatchingPosition() {
    Geolocation.watchPosition({}, async (position, err) => {
      if (err) {
        console.error('Error al observar posición:', err);
        return;
      }

      if (position && position.coords) {
        this.repartidorLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (this.repartidorMarkerId) await this.map.removeMarker(this.repartidorMarkerId);

        this.repartidorMarkerId = await this.map.addMarker({
          coordinate: this.repartidorLatLng!,
          title: 'Repartidor (Ubicación Actual)',
          snippet: 'Ubicación actual',
          iconUrl: 'https://cdn-icons-png.flaticon.com/128/5328/5328070.png',
          iconSize: { width: 30, height: 30 },
        });
      }
    });
  }

  abrirEnGoogleMaps(direccion: string) {
    const encodedAddress = encodeURIComponent(direccion || 'Sin dirección');
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  }

  llamarTelefono(telefono: string) {
    window.open(`tel:${telefono}`, '_system');
  }

  async entregarPedido(solicitud: SolicitudServicio) {
    if (!solicitud?.id_solicitud || !solicitud.lote?.id_lote || !solicitud.cliente?.id_cliente) {
      console.error('Solicitud inválida para entregar pedido.', solicitud);
      return;
    }

    try {
      const usuario = await this.authService.getDecryptedUserData();
      if (!usuario || usuario.id_role !== 3 || !usuario.id_repartidor) {
        console.error('El usuario actual no es un repartidor válido.');
        return;
      }

      const historialEntrega: HistorialEntrega = {
        id_lote: solicitud.lote.id_lote,
        id_tipo_estado: 4,
        descripcion: 'Pedido entregado exitosamente.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaService.agregarHistorial(historialEntrega));

      const historialRepartidor: HistorialEntregaRepartidor = {
        id_solicitud: solicitud.id_solicitud,
        id_repartidor: usuario.id_repartidor,
        descripcion: 'Entrega finalizada por el repartidor.',
        fecha_actualizacion: new Date(),
      };
      await firstValueFrom(this.historialEntregaRepartidorService.agregarHistorial(historialRepartidor));

      await firstValueFrom(
        this.estadoSolicitudServicioService.actualizarEstadoSolicitud(solicitud.id_solicitud, { id_estado_solicitud: 3 })
      );

      const notificacion: Notificacion = {
        id_usuario: solicitud.cliente.id_cliente,
        id_role: 1,
        titulo: 'Tu pedido llegó',
        mensaje: `Tu pedido ha sido entregado exitosamente (${solicitud.cliente.direccion ?? ''}).`,
        leido: false,
        fecha: new Date(),
      };

      await firstValueFrom(this.solicitudRepartidorService.enviarNotificacionCliente(notificacion));
      await this.mostrarMensaje('Pedido entregado exitosamente.', 'success');

      setTimeout(() => {
        this.router.navigate(['/rutas']);
      }, 2000);
    } catch (error) {
      console.error('Error al completar la entrega:', error);
      this.mostrarMensaje('Error al completar la entrega.', 'danger');
    }
  }

  volver() {
    this.router.navigate(['/home']);
  }

  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
