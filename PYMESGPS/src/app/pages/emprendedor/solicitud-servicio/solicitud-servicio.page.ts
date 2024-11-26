import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lote } from 'src/app/models/lote';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { Repartidor } from 'src/app/models/Usuarios/repartidor';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { LoteService } from 'src/app/services/lote/lote.service';
import { firstValueFrom } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { SolicitudServicioService } from 'src/app/services/solicitud-servicio/solicitudservicio.service';
import { Notificacion } from 'src/app/models/notificacion';
import { HistorialEntrega } from 'src/app/models/historial_entrega';
import { HistorialEntregaService } from 'src/app/services/historial-entrega/historial-entrega.service';

@Component({
  selector: 'app-solicitud-servicio',
  templateUrl: './solicitud-servicio.page.html',
  styleUrls: ['./solicitud-servicio.page.scss'],
})
export class SolicitudServicioPage implements OnInit {
  lotes: Lote[] = [];
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  repartidores: Repartidor[] = [];
  solicitudes: SolicitudServicio[] = [];
  solicitud: SolicitudServicio = this.getDefaultSolicitud();
  clienteBusqueda: string = '';

  constructor(
    private solicitudServicioService: SolicitudServicioService,
    private historialEntregaService: HistorialEntregaService,
    private notificacionesService: NotificacionesService,
    private authService: AuthServiceService,
    private clienteService: ClienteService,
    private repartidorService: RepartidorService,
    private loteService: LoteService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    try {
      const usuarioLogueado = await this.authService.getDecryptedUserData();
      if (usuarioLogueado) {
        this.solicitud.id_emprendedor = usuarioLogueado.id_emprendedor;
        await this.cargarDatosIniciales();
      }
    } catch (error) {
      console.error('Error al cargar los datos iniciales:', error);
    }
  }

  public async cargarDatosIniciales(event?: any) {
    try {
      this.clientes = await firstValueFrom(this.clienteService.obtenerClientes());
      this.clientesFiltrados = this.clientes;
      this.repartidores = await firstValueFrom(this.repartidorService.obtenerRepartidoresPorEmprendedor(this.solicitud.id_emprendedor));
      this.lotes = await firstValueFrom(this.loteService.obtenerLotesPorEmprendedor(this.solicitud.id_emprendedor));
      this.solicitudes = await firstValueFrom(this.solicitudServicioService.obtenerSolicitudes());
      event?.target.complete(); // Completar el refresco si se usa el pull-to-refresh
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      this.mostrarMensaje('Error al cargar los datos iniciales', 'danger');
    }
  }

  filtrarClientes() {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre_completo.toLowerCase().includes(this.clienteBusqueda.toLowerCase())
    );
  }

  private getDefaultSolicitud(): SolicitudServicio {
    return {
      id_solicitud: undefined,
      id_emprendedor: 0,
      id_repartidor: 0,
      id_cliente: 0,
      id_lote: 0,
      fecha_solicitud: new Date(),
      observacion: '',
      id_estado_solicitud: 1,
    };
  }

  async crearSolicitud() {
    try {
      this.solicitud.fecha_solicitud = new Date();

      const emprendedorLogueado = await this.authService.getDecryptedUserData();
      if (!emprendedorLogueado || !emprendedorLogueado.id_emprendedor) {
        console.error('No se pudo obtener el emprendedor logueado.');
        this.mostrarMensaje('Error al crear la solicitud: emprendedor no logueado.', 'danger');
        return;
      }
      this.solicitud.id_emprendedor = emprendedorLogueado.id_emprendedor;

      const solicitudCreadaArray = await firstValueFrom(this.solicitudServicioService.agregarSolicitudServicio(this.solicitud));

      if (Array.isArray(solicitudCreadaArray) && solicitudCreadaArray.length > 0) {
        const solicitudCreada = solicitudCreadaArray[0];
        // console.log('Solicitud creada con éxito:', solicitudCreada);

        // Registrar en historial_entrega con estado "En Preparación (1)"
        const historialEntrega: HistorialEntrega = {
          id_lote: this.solicitud.id_lote,
          id_tipo_estado: 1, // Estado "En Preparación"
          descripcion: 'Pedido en Preparación',
          fecha_actualizacion: new Date(),
        };
        await firstValueFrom(this.historialEntregaService.agregarHistorial(historialEntrega));

        await this.crearNotificaciones(solicitudCreada);

        this.limpiarFormulario();
        await this.cargarDatosIniciales();
        this.mostrarMensaje('Solicitud creada correctamente.', 'success');
      } else {
        console.error('Error: Respuesta de creación de solicitud inválida.');
        this.mostrarMensaje('Error al crear la solicitud.', 'danger');
      }
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      this.mostrarMensaje('Error al crear la solicitud.', 'danger');
    }
  }

  private async crearNotificaciones(solicitud: SolicitudServicio) {
    try {
      const lote = this.lotes.find(l => l.id_lote === solicitud.id_lote);
      if (!lote) throw new Error('Lote no encontrado');

      const nombreLote = lote.nombre_lote || 'Desconocido';
      const codigoSeguimiento = lote.codigo_seguimiento || 'N/A';

      const clienteNombre = this.obtenerNombreCliente(solicitud.id_cliente);
      const repartidorNombre = this.obtenerNombreRepartidor(solicitud.id_repartidor);

      const notificacionCliente: Notificacion = {
        id_usuario: solicitud.id_cliente,
        id_role: 1,
        titulo: 'Pedido Creado',
        mensaje: `Hola "${clienteNombre}", Su pedido para el lote "${nombreLote}" ha sido creado con el código de seguimiento: ${codigoSeguimiento}`,
        leido: false,
        fecha: new Date(),
      };

      const notificacionRepartidor: Notificacion = {
        id_usuario: solicitud.id_repartidor,
        id_role: 3,
        titulo: 'Nuevo Pedido Asignado',
        mensaje: `Hola "${repartidorNombre}", Se ha asignado un nuevo pedido, el lote "${nombreLote}" para el/la cliente/a "${clienteNombre}"`,
        leido: false,
        fecha: new Date(),
      };

      await Promise.all([
        firstValueFrom(this.notificacionesService.crearNotificacion(notificacionCliente)),
        firstValueFrom(this.notificacionesService.crearNotificacion(notificacionRepartidor)),
      ]);

      // console.info('Notificaciones creadas con éxito.');
    } catch (error) {
      console.error('Error al crear las notificaciones:', error);
    }
  }

  private limpiarFormulario() {
    this.solicitud = this.getDefaultSolicitud();
    this.clienteBusqueda = '';
    this.clientesFiltrados = this.clientes;
  }

  async eliminarSolicitud(idSolicitud: number) {
    try {
      if (idSolicitud === undefined || idSolicitud === null) {
        console.error('No se puede eliminar la solicitud porque el ID es indefinido.');
        return;
      }

      const alert = await this.alertController.create({
        header: 'Confirmar Eliminación',
        message: '¿Estás seguro de eliminar esta solicitud?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Eliminar',
            handler: async () => {
              await firstValueFrom(this.solicitudServicioService.eliminarSolicitud(idSolicitud));
              await this.cargarDatosIniciales();
              this.mostrarMensaje('Solicitud eliminada correctamente.', 'success');
            },
          },
        ],
      });

      await alert.present();
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
      this.mostrarMensaje('Error al eliminar la solicitud.', 'danger');
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

  obtenerNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.id_cliente === idCliente);
    return cliente ? cliente.nombre_completo : 'Desconocido';
  }

  obtenerNombreLote(idLote: number): string {
    const lote = this.lotes.find(l => l.id_lote === idLote);
    return lote ? lote.nombre_lote : 'Desconocido';
  }

  obtenerNombreRepartidor(idRepartidor: number): string {
    const repartidor = this.repartidores.find(r => r.id_repartidor === idRepartidor);
    return repartidor ? repartidor.nombre_completo : 'Desconocido';
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
