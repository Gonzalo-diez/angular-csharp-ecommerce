import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SignalService } from '../../../core/services/signal/signal.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  isAuth = false;

  constructor(private authService: AuthService, private signalService: SignalService, private router: Router) {}

  ngOnInit(): void {
    // isAuthenticated() ya devuelve un booleano
    this.isAuth = this.authService.isAuthenticated();
  }

  register(): void {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      console.error('Please complete all fields.');
      return;
    }
  
    this.authService.register(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: () => {
        this.isAuth = this.authService.isAuthenticated();
        const user = this.authService.getDecodedUser();
  
        // 👉 Emitir evento a SignalR
        this.signalService.sendRegisterNotification(user);
  
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Error in register:', err);
      }
    });
  }
  
}