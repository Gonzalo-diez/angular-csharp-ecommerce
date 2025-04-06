import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { decodeToken } from '../utils/token.util';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const decoded = decodeToken(token);
    const userId = decoded ? decoded.id : null;

    if (userId) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
        setParams: {
          userId: userId.toString(),
        },
      });
    }
  }

  return next(req);
};
