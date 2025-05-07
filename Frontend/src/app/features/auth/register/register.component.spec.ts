import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SignalService } from '../../../core/services/signal/signal.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

// Mocks
const mockAuthService = {
  isAuthenticated: jest.fn(),
  register: jest.fn(),
  getDecodedUser: jest.fn(),
};

const mockSignalService = {
  startConnections: jest.fn(),
  sendRegisterNotification: jest.fn(),
};

const mockRouter = {
  navigateByUrl: jest.fn(),
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SignalService, useValue: mockSignalService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should update form value when onFileSelected is called', () => {
    const mockFile = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    const event = { target: { files: [mockFile] } };

    component.onFileSelected(event);

    expect(component.authForm.value.image).toBe(mockFile);
  });

  it('should log message if form is invalid on register()', () => {
    console.log = jest.fn();

    component.authForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      image: null,
    });

    component.register();

    expect(console.log).toHaveBeenCalledWith('Formulario inválido');
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call register and navigate on successful registration', () => {
    console.log = jest.fn();
    mockAuthService.register.mockReturnValue(of({}));
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getDecodedUser.mockReturnValue({ email: 'test@test.com' });

    component.authForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: '123456',
      image: new File([''], 'avatar.png'),
    });

    component.register();

    expect(mockAuthService.register).toHaveBeenCalledWith(
      'John',
      'Doe',
      'john@test.com',
      '123456',
      expect.any(File)
    );
    expect(mockSignalService.sendRegisterNotification).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle register error', () => {
    console.error = jest.fn();
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Registration error')));

    component.authForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: '123456',
      image: null,
    });

    component.register();

    expect(console.error).toHaveBeenCalledWith('Error al agregar usuario:', expect.any(Error));
  });
});
