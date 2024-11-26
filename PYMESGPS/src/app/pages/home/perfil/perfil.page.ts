import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';
import { ClienteService } from 'src/app/services/Usuarios/cliente/cliente.service';
import { RepartidorService } from 'src/app/services/Usuarios/repartidor/repartidor.service';
import { EmprendedorService } from 'src/app/services/Usuarios/emprendedor/emprendedor.service';
import { AdminService } from 'src/app/services/Usuarios/admin/admin.service';
import { lastValueFrom } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController, Platform, ActionSheetController } from '@ionic/angular';
import { ImagenPerfilService } from 'src/app/services/imagen-perfil/imagen-perfil.service';

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
  imagenPerfil: string | null = null;
  imagenTemporal: string | null = null;
  isBrowser: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private clienteService: ClienteService,
    private repartidorService: RepartidorService,
    private emprendedorService: EmprendedorService,
    private adminService: AdminService,
    private router: Router,
    private platform: Platform,
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController, 
    private imagenPerfilService: ImagenPerfilService
  ) { }

  async ngOnInit() {
    this.isBrowser = this.platform.is('desktop') || this.platform.is('mobileweb');
    await this.cargarPerfilUsuario(); // Carga el perfil del usuario
    await this.cargarImagenPerfil(); // Carga la imagen del perfil
  }

  /**
  * Carga los datos del perfil del usuario según su rol.
  */
  async cargarPerfilUsuario() {
    const usuario = await this.authService.getDecryptedUserData();
    if (usuario) {
      try {
        // Verificar el rol del usuario basado en id_role
        if (usuario.id_role === 1) { // Cliente
          this.cliente = await lastValueFrom(this.clienteService.obtenerClientePorId(usuario.id_cliente));
          this.emprendedor = null;
          this.repartidor = null;
          this.admin = null;
        } else if (usuario.id_role === 2) { // Emprendedor
          this.emprendedor = await lastValueFrom(this.emprendedorService.obtenerEmprendedorPorId(usuario.id_emprendedor));
          this.cliente = null;
          this.repartidor = null;
          this.admin = null;
        } else if (usuario.id_role === 3) { // Repartidor
          this.repartidor = await lastValueFrom(this.repartidorService.obtenerRepartidorPorId(usuario.id_repartidor));
          this.cliente = null;
          this.emprendedor = null;
          this.admin = null;
        } else if (usuario.id_role === 4) { // Administrador
          this.admin = await lastValueFrom(this.adminService.obtenerAdminPorId(usuario.id_admin));
          this.cliente = null;
          this.emprendedor = null;
          this.repartidor = null;
        } else {
          console.error('Rol no reconocido en cargarPerfilUsuario.');
        }
      } catch (error) {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    } else {
      console.error('No se encontraron datos de usuario.');
      this.cliente = null;
      this.emprendedor = null;
      this.repartidor = null;
      this.admin = null;
    }
    //console.log('Datos del usuario según rol:', { cliente: this.cliente, emprendedor: this.emprendedor, repartidor: this.repartidor, admin: this.admin });
  }

   /**
   * Muestra un menú para seleccionar o capturar una imagen.
   */
   async mostrarOpcionesImagen() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona una opción',
      buttons: [
        {
          text: 'Abrir Galería',
          handler: () => this.cambiarImagenPerfil(CameraSource.Photos),
        },
        {
          text: 'Tomar Foto',
          handler: () => this.cambiarImagenPerfil(CameraSource.Camera),
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  /**
 * Carga la URL de la imagen de perfil del usuario.
 */
  async cargarImagenPerfil() {
    const usuario = await this.authService.getDecryptedUserData();
    let userName = '';

    if (usuario) {
      userName = usuario.nombre_completo.replace(/\s+/g, '-'); 
      
      this.imagenPerfil = `${this.imagenPerfilService.obtenerBaseUrl()}/object/public/profile-images/${userName}/profile.jpg`;
    } else {
    
      this.imagenPerfil = 'assets/default-profile.png';
    }

    //console.log('URL de la imagen de perfil:', this.imagenPerfil);
  }

  /**
   * Permite al usuario seleccionar o capturar una nueva imagen de perfil.
   */
  async cambiarImagenPerfil(source: CameraSource) {
    try {
      if (this.isBrowser) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event: any) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              this.imagenTemporal = reader.result as string; // Asigna imagen temporal
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } else {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl,
          source: source,
        });
        this.imagenTemporal = image.dataUrl || null; // Muestra imagen temporal
      }
    } catch (error) {
      console.error('Error al capturar la imagen:', error);
      this.mostrarMensaje('Error al capturar la imagen', 'danger');
    }
  }

  /**
 * Guarda la imagen de perfil seleccionada y actualiza la página.
 */
  async guardarImagenPerfil() {
    const usuario = await this.authService.getDecryptedUserData();
    let userId = '';
    let userName = '';

    if (usuario) {
      userId = usuario.id_emprendedor?.toString() ||
        usuario.id_cliente?.toString() ||
        usuario.id_repartidor?.toString() ||
        usuario.id_admin?.toString() || '';

      userName = usuario.nombre_completo.replace(/\s+/g, '-');
    }

    if (!userId || !userName || !this.imagenTemporal) {
      this.mostrarMensaje('No se seleccionó ninguna imagen o faltan datos.', 'warning');
      return;
    }

    try {
      const blob = this.dataUrlToBlob(this.imagenTemporal);
      const publicUrl = await this.imagenPerfilService.subirImagen(userId, userName, blob);

      // Actualizar la imagen en el frontend
      this.imagenPerfil = publicUrl; // Actualiza la URL
      this.imagenTemporal = null;
      this.mostrarMensaje('Imagen de perfil guardada correctamente', 'success');

      // Actualizar la página para reflejar el cambio de la imagen
      await this.actualizarDatos();
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
      this.mostrarMensaje('Error al guardar la imagen de perfil', 'danger');
    }
  }

  /**
   * Actualiza los datos de la página, incluyendo la imagen de perfil.
   */
  async actualizarDatos() {
    try {
      await this.cargarPerfilUsuario(); // Recargar datos del usuario
      await this.cargarImagenPerfil(); // Recargar URL de la imagen
    } catch (error) {
      console.error('Error al actualizar los datos de la página:', error);
      this.mostrarMensaje('Error al actualizar la información.', 'danger');
    }
  }

  /**
   * Convierte una imagen en formato base64 a un Blob.
   */
  dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }

  /**
   * Muestra un mensaje Toast con el color y contenido especificado.
   */
  async mostrarMensaje(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
    });
    toast.present();
  }

  /**
   * Navega a la página anterior según el tipo de usuario.
   */
  async volver() {
    const usuario = await this.authService.getDecryptedUserData();
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
      this.router.navigate(['/login']);
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
