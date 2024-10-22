import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

export const isadminGuard: CanActivateFn = async (route, state) => {
  const _authService = inject(AuthServiceService);
  const router = inject(Router);

  try {
    // Obtener la información desencriptada del usuario
    const userInfo = await _authService.getDecryptedUserData();

    // Rol de administrador (id_role = 4)
    if (userInfo?.id_admin && userInfo?.id_role === 4) {
      //console.log("Acceso permitido: usuario es administrador");
      return true;
    } else {
      console.warn("Acceso denegado: el usuario no es administrador");
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error("Error al verificar el estado del administrador:", error);
    router.navigate(['/login']);
    return false;
  }
};
