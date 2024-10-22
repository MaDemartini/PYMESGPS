import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

export const isClienteGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  try {
    const userInfo = await authService.getDecryptedUserData();
    if (userInfo?.id_cliente && userInfo?.id_role === 1)  {
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
