import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [NgClass, NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isSidebarOpen = false;
  isCategoriesOpen = false;
  isTechOpen = false;
  isClothingOpen = false;
  isHomeOpen = false;
  isAuth = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuth = authStatus;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  toggleCategories() {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }
  
  toggleSubcategory(category: string) {
    if (category === 'tech') this.isTechOpen = !this.isTechOpen;
    if (category === 'clothing') this.isClothingOpen = !this.isClothingOpen;
    if (category === 'home') this.isHomeOpen = !this.isHomeOpen;
  }

  isAuthenticated() {
    this.authService.isAuthenticated();
  }

  cart() {
    this.router.navigate(['/cart']);
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
