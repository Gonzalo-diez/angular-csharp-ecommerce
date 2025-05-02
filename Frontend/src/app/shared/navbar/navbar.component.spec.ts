import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { SignalService } from '../../core/services/signal/signal.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRole } from '../../core/models/auth/auth.role';

describe('NavbarComponent (Jest)', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let signalServiceMock: jest.Mocked<SignalService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated: jest.fn().mockReturnValue(false),
      getDecodedUser: jest.fn().mockReturnValue(null),
      getUserById: jest.fn().mockReturnValue(of({ name: 'Test User' })),
      logout: jest.fn()
    } as any;

    signalServiceMock = {
      startConnections: jest.fn(),
      sendLogoutNotification: jest.fn()
    } as any;

    routerMock = {
      navigate: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, NavbarComponent],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SignalService, useValue: signalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    expect(component.isSidebarOpen).toBe(false);
    component.toggleSidebar();
    expect(component.isSidebarOpen).toBe(true);
  });

  it('should toggle categories', () => {
    expect(component.isCategoriesOpen).toBe(false);
    component.toggleCategories();
    expect(component.isCategoriesOpen).toBe(true);
  });

  it('should toggle subcategories correctly', () => {
    component.toggleSubcategory('tech');
    expect(component.isTechOpen).toBe(true);
    component.toggleSubcategory('clothing');
    expect(component.isClothingOpen).toBe(true);
    component.toggleSubcategory('home');
    expect(component.isHomeOpen).toBe(true);
  });

  it('should toggle avatar menu', () => {
    expect(component.avatarMenuOpen).toBe(false);
    component.toggleAvatarMenu();
    expect(component.avatarMenuOpen).toBe(true);
  });

  it('should navigate to search page on search()', () => {
    component.searchTerm = 'laptop';
    component.search();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/product/search'], { queryParams: { q: 'laptop' } });
  });

  it('should navigate to login page on login()', () => {
    component.login();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should navigate to upgradeRole page on upgradeRole()', () => {
    component.upgradeRole();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/upgradeRole']);
  });

  it('should navigate to dashboard on dashboard()', () => {
    component.dashboard();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to cart on cart()', () => {
    component.cart();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should call logout and navigate to home', () => {
    authServiceMock.getDecodedUser.mockReturnValue({ id: 123, role: AuthRole.User });
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(signalServiceMock.sendLogoutNotification).toHaveBeenCalledWith(123);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
