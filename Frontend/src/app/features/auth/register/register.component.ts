import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuth = authStatus;
    })
  }

  register() {
    if(!this.firstName || !this.lastName || !this.email || !this.password) {
      console.error('Please complete all fields of this form.');
      return;
    }

    this.authService.register(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: () => {
        this.isAuth = true;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error in register:', err);
      }
    })
  }
}
