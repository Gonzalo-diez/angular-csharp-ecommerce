import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { SignalService } from '../../core/services/signal/signal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isSidebarOpen = false;
  isCategoriesOpen = false;
  isTechOpen = false;
  isClothingOpen = false;
  isHomeOpen = false;
  isAuth = false;

  constructor(
    private authService: AuthService,
    private signalService: SignalService,
    private router: Router
  ) {}

  // ✅ Aquí sí se puede usar `effect`, porque estamos dentro del contexto de la clase
  readonly authEffect = effect(() => {
    this.isAuth = this.authService.authStatus(); // asumiendo que retorna un `signal<boolean>`
  });

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
    return this.authService.isAuthenticated();
  }

  cart() {
    this.router.navigate(['/cart']);
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  logout() {
    try {
      const user = this.authService.getDecodedUser();

      this.authService.logout();

      if (user && user.id) {
        this.signalService.sendLogoutNotification(user.id);
      }

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  }
}