import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/Usuarios/cliente';
import { Emprendedor } from 'src/app/models/Usuarios/emprendedor';
import { Repartidor } from 'src/app/models/Usuarios/repartidor';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-gestionar-usuario',
  templateUrl: './gestionar-usuario.page.html',
  styleUrls: ['./gestionar-usuario.page.scss'],
})
export class GestionarUsuarioPage implements OnInit {
  clientes: Cliente[] = [];
  emprendedores: Emprendedor[] = [];
  repartidores: Repartidor[] = [];

  constructor(
    private clienteService: ClienteService,
    private emprendedorService: EmprendedorService,
    private repartidorService: RepartidorService,
    private router: Router,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  // Método para cargar todos los tipos de usuarios
  async cargarUsuarios() {
    try {
      this.clientes = await firstValueFrom(this.clienteService.obtenerClientes());
      this.emprendedores = await firstValueFrom(this.emprendedorService.obtenerEmprendedores());
      this.repartidores = await firstValueFrom(this.repartidorService.obtenerRepartidores());
    } catch (error) {
      this.mostrarMensaje('Error al cargar los usuarios.', 'danger');
      console.error('Error al cargar usuarios:', error);
    }
  }

  // Método para confirmar y eliminar un usuario
  async confirmarEliminarUsuario(id_usuario: number, tipo: 'cliente' | 'emprendedor' | 'repartidor') {
    const alert = await this.toastController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar este ${tipo}? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => console.log('Eliminación cancelada'),
        },
        {
          text: 'Eliminar',
          handler: () => this.eliminarUsuario(id_usuario, tipo),
        },
      ],
    });

    await alert.present();
  }

  // Método para eliminar un usuario por tipo
  async eliminarUsuario(id_usuario: number, tipo: 'cliente' | 'emprendedor' | 'repartidor') {
    try {
      if (tipo === 'cliente') {
        await firstValueFrom(this.clienteService.eliminarCliente(id_usuario));
      } else if (tipo === 'emprendedor') {
        await firstValueFrom(this.emprendedorService.eliminarEmprendedor(id_usuario));
      } else if (tipo === 'repartidor') {
        await firstValueFrom(this.repartidorService.eliminarRepartidor(id_usuario));
      }

      await this.cargarUsuarios(); // Recargar los usuarios activos
      this.mostrarMensaje('Usuario deshabilitado con éxito.', 'success');
    } catch (error) {
      this.mostrarMensaje('Error al deshabilitar el usuario.', 'danger');
      console.error('Error al deshabilitar el usuario:', error);
    }
  }

  // Métodos para redirigir a las páginas de agregar o editar usuario según el tipo
  agregarUsuario(tipo: 'cliente' | 'emprendedor' | 'repartidor') {
    this.router.navigate([`/agregar-${tipo}`]);
  }

  editarUsuario(id_usuario: number, tipo: 'cliente' | 'emprendedor' | 'repartidor') {
    this.router.navigate([`/editar-${tipo}`, id_usuario]);
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
    this.router.navigate(['/home-admin']);
  }
}
