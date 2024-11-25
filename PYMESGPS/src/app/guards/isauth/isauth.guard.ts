import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from 'src/app/services/autentificacion/autentificacion.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthServiceService);
  const router = inject(Router);

  try {
    const userInfo = await authService.getDecryptedUserData();
    if (userInfo) {
      return true;
    } else {
      router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  } catch (error) {
    router.navigate(['/login'],  { replaceUrl: true });
    return false;
  }
};