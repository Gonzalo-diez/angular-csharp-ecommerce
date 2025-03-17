import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
    })
  }

  login() {
    if(!this.email || !this.password) {
      console.error('Please complete all fields of this form.')
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isAuth = true;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error in login:', err);
      },
    });
  }
}
