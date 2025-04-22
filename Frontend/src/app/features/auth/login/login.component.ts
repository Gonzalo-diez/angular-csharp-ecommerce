import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SignalService } from '../../../core/services/signal/signal.service';
import { AuthRole } from '../../../core/models/auth/auth.role';

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

  constructor(private authService: AuthService, private signalService: SignalService, private router: Router) {}

  ngOnInit(): void {
    // isAuthenticated() ya devuelve un booleano, por lo que no necesitamos suscribirse.
    this.signalService.startConnections();
    this.isAuth = this.authService.isAuthenticated();
  }

  login(): void {
    if (!this.email || !this.password) {
      console.error('Please complete all fields.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isAuth = this.authService.isAuthenticated();
        const user = this.authService.getDecodedUser();

        // 👉 Emitir evento a SignalR
        this.signalService.sendLoginNotification(user);

        if (user?.role === AuthRole.Admin) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
      },
    });
  }
}
