import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { Emprendedor } from 'src/app/models/Usuarios/emprendedor';
import { firstValueFrom } from 'rxjs';
import { ActualizarEmprendedor } from 'src/app/models/Actualizar/Usuarios/actualizarEmprendedor';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-editar-emprendedor',
  templateUrl: './editar-emprendedor.page.html',
  styleUrls: ['./editar-emprendedor.page.scss'],
})
export class EditarEmprendedorPage implements OnInit {
  emprendedor: Emprendedor = {} as Emprendedor;

  constructor(
    private emprendedorService: EmprendedorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const idEmprendedor = Number(this.route.snapshot.paramMap.get('id'));
    await this.cargarEmprendedor(idEmprendedor);
  }

  async cargarEmprendedor(id: number) {
    try {
      this.emprendedor = await firstValueFrom(this.emprendedorService.obtenerEmprendedorPorId(id));
    } catch (error) {
      this.mostrarMensaje('Error al cargar el emprendedor', 'danger');
      console.error('Error al cargar el emprendedor:', error);
    }
  }

  async editarEmprendedor() {
    try {
      const emprendedorActualizado: ActualizarEmprendedor = {
        ...this.emprendedor,
        id_role: this.emprendedor.id_role.id_role  // Convertir a número
      };
  
      await firstValueFrom(this.emprendedorService.actualizarEmprendedor(this.emprendedor.id_emprendedor, emprendedorActualizado));
      this.mostrarMensaje('Emprendedor actualizado con éxito', 'success');
      this.router.navigate(['/gestionar-usuario']);
    } catch (error) {
      this.mostrarMensaje('Error al actualizar el emprendedor', 'danger');
      console.error('Error al actualizar el emprendedor:', error);
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
