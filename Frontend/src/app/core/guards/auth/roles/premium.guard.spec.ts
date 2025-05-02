import { premiumGuard } from './premium.guard';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthRole } from '../../../models/auth/auth.role';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('premiumGuard', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      getDecodedUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('debería permitir acceso si el usuario es premium', () => {
    mockAuthService.getDecodedUser.mockReturnValue({
      id: 1,
      role: AuthRole.Premium,
    });

    const result = TestBed.runInInjectionContext(() =>
      premiumGuard(mockRoute, mockState)
    );

    expect(result).toBe(true);
  });

  it('debería denegar acceso y redirigir si no es premium', () => {
    mockAuthService.getDecodedUser.mockReturnValue({
      id: 1,
      role: AuthRole.User,
    });

    const result = TestBed.runInInjectionContext(() =>
      premiumGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería denegar acceso y redirigir si no hay usuario', () => {
    mockAuthService.getDecodedUser.mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      premiumGuard(mockRoute, mockState)
    );

    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
