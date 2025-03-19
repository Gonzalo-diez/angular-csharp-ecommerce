import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isSidebarOpen = false;
  isAuth = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuth = authStatus;
    })
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  isAuthenticated() {
    this.authService.isAuthenticated();
  }

  login() {
    window.location.href = '/auth/login';
  }

  logout() {
    this.authService.logout()
  }
}
