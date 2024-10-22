import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

export const isEmprendedorGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  try {
    const userInfo = await authService.getDecryptedUserData();
    if (userInfo?.id_emprendedor && userInfo?.id_role === 2) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }

};
