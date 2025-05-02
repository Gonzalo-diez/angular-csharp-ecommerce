import { adminGuard } from './admin.guard';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthRole } from '../../../models/auth/auth.role';

describe('adminGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      getDecodedUser: jest.fn(),
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('debería permitir acceso si el usuario es admin', () => {
    mockAuthService.getDecodedUser.mockReturnValue({
      id: 1,
      role: AuthRole.Admin,
      exp: 10000,
    });

    const result = TestBed.runInInjectionContext(() =>
      adminGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
  });

  it('debería redirigir si el usuario no es admin', () => {
    mockAuthService.getDecodedUser.mockReturnValue({ id: 1, role: AuthRole.User, exp: 10000 });
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  
    const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
  
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '🚫 Acceso denegado, solo usuarios admin pueden ir al dashboard.'
    );
  });
  

  it('debería redirigir si no hay usuario logueado', () => {
    mockAuthService.getDecodedUser.mockReturnValue(null);
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '🚫 Acceso denegado, solo usuarios admin pueden ir al dashboard.'
    );
  });
});
