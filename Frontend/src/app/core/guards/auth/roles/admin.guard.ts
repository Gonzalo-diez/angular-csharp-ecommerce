import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRole } from '../../../models/auth/auth.role';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getDecodedUser();
  const userRole = user?.role;
  if (userRole == AuthRole.Admin) {
    return true;
  } else {
    console.warn('🚫 Acceso denegado, solo usuarios admin pueden ir al dashboard.');
    router.navigate(['/']);
    return false;
  }
};
