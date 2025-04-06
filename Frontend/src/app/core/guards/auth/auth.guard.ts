import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // ✅ Usuario autenticado, permite acceso
  } else {
    console.warn('⛔ No autenticado, redirigiendo al login...');
    router.navigate(['/login']); // 🔄 Redirigir al login
    return false;
  }
};