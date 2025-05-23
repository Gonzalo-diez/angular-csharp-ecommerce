import { Component, OnInit, PLATFORM_ID, Inject, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { SignalService } from '../../core/services/signal/signal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  searchTerm = '';
  user: any = null;
  avatarMenuOpen = false;

  constructor(
    private authService: AuthService,
    private signalService: SignalService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      this.isAuth = isAuthenticated;
  
      if (isAuthenticated) {
        const decodedUser = this.authService.getDecodedUser();
        if (decodedUser && decodedUser.id) {
          this.authService.getUserById(decodedUser.id).subscribe({
            next: (userData) => {
              this.user = userData;
            },
            error: (err) => {
              console.error('Error al obtener los datos del usuario:', err);
            }
          });
        }
      } else {
        this.user = null;
      }
    });
  }
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.signalService.startConnections();
    }
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

  toggleAvatarMenu() {
    this.avatarMenuOpen = !this.avatarMenuOpen;
  }

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/product/search'], { queryParams: { q: this.searchTerm } });
      this.searchTerm = '';
      if (this.isSidebarOpen) this.toggleSidebar();
    }
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

  upgradeRole() {
    this.router.navigate(['/auth/upgradeRole']);
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
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