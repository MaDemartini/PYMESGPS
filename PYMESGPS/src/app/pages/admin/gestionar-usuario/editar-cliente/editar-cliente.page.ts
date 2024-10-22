import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { firstValueFrom } from 'rxjs';
import { ActualizarCliente } from 'src/app/models/Actualizar/Usuarios/actualizarCliente';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.page.html',
  styleUrls: ['./editar-cliente.page.scss'],
})
export class EditarClientePage implements OnInit {
  cliente: Cliente = {} as Cliente;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const idCliente = Number(this.route.snapshot.paramMap.get('id'));
    await this.cargarCliente(idCliente);
  }

  async cargarCliente(id: number) {
    try {
      this.cliente = await firstValueFrom(this.clienteService.obtenerClientePorId(id));
    } catch (error) {
      this.mostrarMensaje('Error al cargar el cliente', 'danger');
      console.error('Error al cargar el cliente:', error);
    }
  }

  async editarCliente() {
    try {
      const clienteActualizado: ActualizarCliente = {
        ...this.cliente,
        id_role: this.cliente.id_role.id_role 
      };
  
      await firstValueFrom(this.clienteService.actualizarCliente(this.cliente.id_cliente, clienteActualizado));
      this.mostrarMensaje('Cliente actualizado con éxito', 'success');
      this.router.navigate(['/gestionar-usuario']);
    } catch (error) {
      this.mostrarMensaje('Error al actualizar el cliente', 'danger');
      console.error('Error al actualizar el cliente:', error);
    }
  }
  
  private async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: color === 'danger' ? 'warning' : 'checkmark-circle',
        }
      ]
    });
    toast.present();
  }

  volver() {
    this.router.navigate(['/gestionar-usuario']);
  }
}
