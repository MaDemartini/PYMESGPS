import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudServicioService } from 'src/app/services/solicitud-servicio/solicitudservicio.service';
import { SolicitudServicio } from 'src/app/models/solicitud_servicio';
import { firstValueFrom } from 'rxjs';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {
  pedidos: SolicitudServicio[] = []; // Lista de pedidos del emprendedor
  cargando: boolean = false; // Indicador de carga

  constructor(
    private solicitudServicioService: SolicitudServicioService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarPedidos();
  }

  async cargarPedidos() {
    this.cargando = true;
    try {
      // Obtener usuario autenticado
      const usuario = await this.authService.getDecryptedUserData();
      if (!usuario || usuario.id_role !== 2 || !usuario.id_emprendedor) {
        console.error('Usuario no autorizado o no es emprendedor');
        return;
      }

      const idEmprendedor = usuario.id_emprendedor;

      // Obtener solicitudes realizadas por el emprendedor
      const solicitudesBasicas = await firstValueFrom(
        this.solicitudServicioService.obtenerSolicitudesPorEmprendedor(idEmprendedor)
      );
      console.log('Solicitudes básicas cargadas:', solicitudesBasicas);

      const solicitudesConDetalles = await Promise.all(
        solicitudesBasicas.map(async (solicitud) => {
          const cliente = solicitud.id_cliente
            ? await firstValueFrom(this.solicitudServicioService.obtenerClientePorId(solicitud.id_cliente))
            : null;

          const repartidor = solicitud.id_repartidor
            ? await firstValueFrom(this.solicitudServicioService.obtenerRepartidorPorId(solicitud.id_repartidor))
            : null;

          const estado = solicitud.id_estado_solicitud
            ? await firstValueFrom(this.solicitudServicioService.obtenerEstadoPorId(solicitud.id_estado_solicitud))
            : null;

          let lote = null;
          if (solicitud.id_lote) {
            const loteData = await firstValueFrom(this.solicitudServicioService.obtenerLotePorId(solicitud.id_lote));
            const productos = await firstValueFrom(this.solicitudServicioService.obtenerProductosPorLoteId(solicitud.id_lote));
            lote = { ...loteData, productos };
          }

          return {
            ...solicitud,
            cliente,
            repartidor,
            estado_solicitud: estado,
            lote,
          };
        })
      );

      this.pedidos = solicitudesConDetalles;
      console.log('Solicitudes con detalles cargadas:', this.pedidos);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      this.cargando = false;
    }
  }

  // Métodos auxiliares para mapear datos del modelo
  obtenerNombreCliente(pedido: SolicitudServicio): string {
    return pedido.cliente?.nombre_completo || 'Desconocido';
  }

  obtenerNombreLote(pedido: SolicitudServicio): string {
    return pedido.lote?.nombre_lote || 'Desconocido';
  }

  obtenerCodigoSeguimiento(pedido: SolicitudServicio): string {
    return pedido.lote?.codigo_seguimiento || 'N/A';
  }

  obtenerNombreRepartidor(pedido: SolicitudServicio): string {
    return pedido.repartidor?.nombre_completo || 'Desconocido';
  }

  obtenerPrecioLote(pedido: SolicitudServicio): number {
    if (pedido.lote?.productos) {
      return pedido.lote.productos.reduce(
        (total, item) => total + (item.producto?.precio_prod || 0) * (item.cantidad || 0),
        0
      );
    }
    return 0;
  }

  volver() {
    this.router.navigate(['/home']);
  }
}
