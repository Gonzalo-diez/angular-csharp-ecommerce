import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRole } from '../../../models/auth/auth.role';

export const premiumGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getDecodedUser();
  const userRole = user?.role;
  if (userRole === AuthRole.Premium) {
    return true;
  } else {
    console.warn('🚫 Acceso denegado, solo usuarios premium pueden agregar productos.');
    router.navigate(['/']);
    return false;
  }
};
