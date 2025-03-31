import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AuthRole, AuthRoleMap } from '../../../core/models/auth/auth.role';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isAuth = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuth = authStatus;
    });
  }

  login() {
    if (!this.email || !this.password) {
      console.error('Please complete all fields of this form.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isAuth = true;
        const token = this.authService.getToken();

        if (token) {
          const user = this.decodeToken(token);
          if (user && user.role) {
            if (user.role === AuthRole.Admin) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            console.error('User role not found.');
            this.router.navigate(['/']);
          }
        } else {
          console.error('Token not found.');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error in login:', err);
      },
    });
  }

  private decodeToken(token: string): { id: number; role: AuthRole } | null {
    try {
      const base64Url = token.split('.')[1]; // Extrae la parte del payload del JWT
      if (!base64Url) return null;

      const payload = JSON.parse(atob(base64Url)); // Decodifica el payload
      console.log('Payload:', payload);

      // Intentar obtener el rol desde el claim estándar
      let role: AuthRole | null =
        payload[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ?? null;

      // Si no existe, buscar dentro del objeto `user`
      if (!role && payload.user) {
        const userData = JSON.parse(payload.user);
        role = AuthRoleMap[userData.Role] ?? null; // Convertir número a string usando el mapeo
      }

      if (!role) {
        console.error('No se pudo determinar el rol del usuario.');
        return null;
      }

      return {
        id:
          parseInt(
            payload[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
            ],
            10
          ) ?? null,
        role,
      };
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
