import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';
import { lastValueFrom } from 'rxjs';  // Importamos lastValueFrom para manejar las promesas

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  emprendedor: any;
  cliente: any;
  repartidor: any;
  admin: any;
  previousUrl: string = '';

  constructor(
    private authService: AuthServiceService,  // Usamos AuthService para la autenticación
    private clienteService: ClienteService,
    private repartidorService: RepartidorService,
    private emprendedorService: EmprendedorService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPerfilUsuario();  // Cargar los datos del perfil del usuario logueado
    this.previousUrl = this.router.getCurrentNavigation()?.extras?.state?.['previousUrl'] || '/home';
  }

  async cargarPerfilUsuario() {
    const usuario = await this.authService.getDecryptedUserData();  // Obtener datos desencriptados del usuario

    if (usuario) {
      try {
        if (usuario.id_cliente) {
          this.cliente = await lastValueFrom(this.clienteService.obtenerClientePorId(usuario.id_cliente));
          //console.log('Datos del cliente:', this.cliente);
        } else if (usuario.id_emprendedor) {
          this.emprendedor = await lastValueFrom(this.emprendedorService.obtenerEmprendedorPorId(usuario.id_emprendedor));
          //console.log('Datos del emprendedor:', this.emprendedor);
        } else if (usuario.id_repartidor) {
          this.repartidor = await lastValueFrom(this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor));
          //console.log('Datos del repartidor:', this.repartidor);
        } else if (usuario.id_admin) {
          this.admin = await lastValueFrom(this.adminService.obtenerAdminPorId(usuario.id_admin));
          //console.log('Datos del admin:', this.admin);
        }
      } catch (error) {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    }
  }

  async volver() {
    const usuario = await this.authService.getDecryptedUserData();  // Obtener datos desencriptados del usuario
    if (usuario) {
      if (usuario.id_cliente) {
        this.router.navigate(['/home-cliente']);
      } else if (usuario.id_emprendedor) {
        this.router.navigate(['/home']);
      } else if (usuario.id_repartidor) {
        this.router.navigate(['/home']);
      } else if (usuario.id_admin) {
        this.router.navigate(['/home-admin']);
      }
    } else {
      this.router.navigate(['/login']);  // En caso de que no se pueda determinar el tipo de usuario, redirigir al login
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
