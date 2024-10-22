import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lote } from 'src/app/models/lote';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { EstadoSolicitudServicio } from 'src/app/models/estado_solicitud_servicio';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { Repartidor } from 'src/app/models/Usuarios/repartidor';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { LoteService } from 'src/app/services/lote/lote.service';
import { firstValueFrom } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { Notificacion } from 'src/app/models/notificacion';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { SolicitudServicioService } from 'src/app/services/solicitud-servicio/solicitudservicio.service';

@Component({
  selector: 'app-solicitud-servicio',
  templateUrl: './solicitud-servicio.page.html',
  styleUrls: ['./solicitud-servicio.page.scss'],
})
export class SolicitudServicioPage implements OnInit {
  lotes: Lote[] = [];
  clientes: Cliente[] = [];
  repartidores: Repartidor[] = [];
  solicitudes: SolicitudServicio[] = [];
  solicitud: SolicitudServicio = this.getDefaultSolicitud();
  estados: EstadoSolicitudServicio[] = [];
  solicitudExistente: boolean = false; // Definición del estado

  constructor(
    private solicitudServicioService: SolicitudServicioService,
    private notificacionesService: NotificacionesService,
    private authService: AuthServiceService,
    private clienteService: ClienteService,
    private repartidorService: RepartidorService,
    private loteService: LoteService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    try {
      await this.cargarDatosIniciales();
      //console.log('Solicitudes cargadas:', this.solicitudes);
    } catch (error) {
      console.error('Error al cargar los datos iniciales:', error);
    }
  }

  private async cargarDatosIniciales() {
    this.clientes = await firstValueFrom(this.clienteService.obtenerClientes());
    this.repartidores = await firstValueFrom(this.repartidorService.obtenerRepartidores());
    this.lotes = await firstValueFrom(this.loteService.obtenerLotesPorEmprendedor(1));
    this.estados = await firstValueFrom(this.solicitudServicioService.obtenerEstadosSolicitud());
    this.solicitudes = await firstValueFrom(this.solicitudServicioService.obtenerSolicitudes());

    // Verificar si ya existe una solicitud para el lote y cliente seleccionados
    this.solicitudExistente = this.solicitudes.some(solicitud =>
      solicitud.id_lote === this.solicitud.id_lote && solicitud.id_cliente === this.solicitud.id_cliente
    );
  }

  private getDefaultSolicitud(): SolicitudServicio {
    return {
      id_solicitud: undefined, // Autoincremental, no se asigna al crear
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
        return;
      }
      this.solicitud.id_emprendedor = emprendedorLogueado.id_emprendedor;
      this.solicitud.id_estado_solicitud = Number(this.solicitud.id_estado_solicitud);
  
      const solicitudCreada = await firstValueFrom(this.solicitudServicioService.agregarSolicitudServicio(this.solicitud));
  
      if (solicitudCreada?.id_solicitud) {
        //console.info('Solicitud creada con éxito.');
        await this.crearNotificaciones(solicitudCreada.id_solicitud); 
        this.limpiarFormulario();
        this.mostrarMensaje('Solicitud creada correctamente.');
      } else {
        console.error('Error al crear la solicitud: Respuesta vacía o inválida.');
        this.mostrarMensaje('Error al crear la solicitud.', 'danger');
      }
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      this.mostrarMensaje('Error al crear la solicitud.', 'danger');
    }
  }

  private async crearNotificaciones(idSolicitud: number) {
    try {
        const lote = await firstValueFrom(this.loteService.obtenerLotePorId(this.solicitud.id_lote));
        
        if (!lote) {
            throw new Error('Lote no encontrado');
        }

        const nombreLote = lote.nombre_lote || 'Desconocido';
        const codigoSeguimiento = lote.codigo_seguimiento || 'N/A';

        // Notificación para el cliente
        const notificacionCliente: Notificacion = {
            id_usuario: this.solicitud.id_cliente,
            id_role: 1,
            titulo: 'Pedido Creado',
            mensaje: `Su pedido para el lote "${nombreLote}" ha sido creado con el código de seguimiento: ${codigoSeguimiento}`,
            leido: false,
            fecha: new Date(),
        };

        // Notificación para el repartidor
        const notificacionRepartidor: Notificacion = {
            id_usuario: this.solicitud.id_repartidor,
            id_role: 3,
            titulo: 'Nuevo Pedido Asignado',
            mensaje: `Se ha asignado un nuevo pedido para el lote "${nombreLote}" con el código de seguimiento: ${codigoSeguimiento}`,
            leido: false,
            fecha: new Date(),
        };  
    
      await Promise.all([
        firstValueFrom(this.notificacionesService.crearNotificacion(notificacionCliente)),
        firstValueFrom(this.notificacionesService.crearNotificacion(notificacionRepartidor)),
      ]);
  
      console.info('Notificaciones creadas con éxito.');
    } catch (error) {
      console.error('Error al crear las notificaciones:', error);
    }
  }

  private limpiarFormulario() {
    this.solicitud = this.getDefaultSolicitud();
    this.solicitudExistente = false; // Reiniciar estado de existencia
  }

  private async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top',
    });
    toast.present();
  }

  async eliminarSolicitud(idSolicitud: number) {
    try {
      // Verificar que el ID no sea indefinido o nulo
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
              // Llamar al servicio de eliminación
              await firstValueFrom(this.solicitudServicioService.eliminarSolicitud(idSolicitud));
              console.info('Solicitud eliminada con éxito.');
              // Actualizar la lista de solicitudes
              this.solicitudes = this.solicitudes.filter((s) => s.id_solicitud !== idSolicitud);
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
  
  // Métodos auxiliares para obtener nombres
  obtenerNombreLote(idLote: number): string {
    const lote = this.lotes.find(l => l.id_lote === idLote);
    return lote ? lote.nombre_lote : 'Desconocido';
  }

  obtenerNombreCliente(idCliente: number): string {
    const cliente = this.clientes.find(c => c.id_cliente === idCliente);
    return cliente ? cliente.nombre_completo : 'Desconocido';
  }

  obtenerNombreRepartidor(idRepartidor: number): string {
    const repartidor = this.repartidores.find(r => r.id_repartidor === idRepartidor);
    return repartidor ? repartidor.nombre_completo : 'Desconocido';
  }

  obtenerNombreEstado(idEstado: number): string {
    const estado = this.estados.find(e => e.id_estado_solicitud === idEstado);
    return estado ? estado.nombre_estado : 'Desconocido';
  }

  verDetallesLote(idLote: number) {
    this.router.navigate(['/detalle-lote', idLote]);
  }

  obtenerCodigoQR(idSolicitud: number) {
    return `https://example.com/qrcode/${idSolicitud}`;
  }
}
