import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SignalService } from '../../../core/services/signal/signal.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthRole } from '../../../core/models/auth/auth.role';

// Mocks
const mockAuthService = {
  isAuthenticated: jest.fn(),
  login: jest.fn(),
  getDecodedUser: jest.fn(),
};

const mockSignalService = {
  startConnections: jest.fn(),
  sendLoginNotification: jest.fn(),
};

const mockRouter = {
  navigateByUrl: jest.fn(),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SignalService, useValue: mockSignalService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and start SignalR connection on ngOnInit', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    component.ngOnInit();

    expect(mockSignalService.startConnections).toHaveBeenCalled();
    expect(component.isAuth).toBe(true);
  });

  it('should log error if login fields are empty', () => {
    console.error = jest.fn();

    component.email = '';
    component.password = '';
    component.login();

    expect(console.error).toHaveBeenCalledWith('Please complete all fields.');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should login and redirect to dashboard if admin', () => {
    component.email = 'admin@test.com';
    component.password = 'password123';

    mockAuthService.login.mockReturnValue(of({}));
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getDecodedUser.mockReturnValue({ role: AuthRole.Admin });

    component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('admin@test.com', 'password123');
    expect(mockSignalService.sendLoginNotification).toHaveBeenCalledWith({ role: AuthRole.Admin });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should login and redirect to home if not admin', () => {
    component.email = 'user@test.com';
    component.password = 'password123';

    mockAuthService.login.mockReturnValue(of({}));
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getDecodedUser.mockReturnValue({ role: AuthRole.Premium });

    component.login();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle login error', () => {
    console.error = jest.fn();

    component.email = 'fail@test.com';
    component.password = 'wrongpass';

    mockAuthService.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));

    component.login();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Login error:', expect.any(Error));
  });
});
