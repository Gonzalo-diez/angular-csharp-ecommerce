import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeRoleComponent } from './upgrade-role.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

// Mocks
const mockAuthService = {
  getDecodedUser: jest.fn(),
  upgradeToPremium: jest.fn(),
};

const mockRouter = {
  navigateByUrl: jest.fn(),
};

describe('UpgradeRoleComponent', () => {
  let component: UpgradeRoleComponent;
  let fixture: ComponentFixture<UpgradeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeRoleComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeRoleComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty and invalid values', () => {
    const form = component.upgradeForm;
    expect(form.valid).toBeFalsy();
    expect(form.value.paymentMethod).toBe('');
    expect(form.value.cardNumber).toBe('');
    expect(form.value.securityNumber).toBe('');
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.getDecodedUser).not.toHaveBeenCalled();
    expect(component.upgradeSuccess).toBeFalsy();
  });

  it('should show error if no decoded user found', () => {
    component.upgradeForm.patchValue({
      paymentMethod: 'Visa',
      cardNumber: '1234567812345678',
      securityNumber: '123',
    });

    mockAuthService.getDecodedUser.mockReturnValue(null);

    component.onSubmit();

    expect(component.upgradeError).toBe('No se encontró el usuario autenticado');
    expect(mockAuthService.upgradeToPremium).not.toHaveBeenCalled();
  });

  it('should call upgradeToPremium and navigate on success', () => {
    console.log = jest.fn();

    component.upgradeForm.patchValue({
      paymentMethod: 'Visa',
      cardNumber: '1234567812345678',
      securityNumber: '123',
    });

    mockAuthService.getDecodedUser.mockReturnValue({ id: 'userId' });
    mockAuthService.upgradeToPremium.mockReturnValue(of({ success: true }));

    component.onSubmit();

    expect(mockAuthService.upgradeToPremium).toHaveBeenCalledWith('Visa', '1234567812345678', '123');
    expect(component.upgradeSuccess).toBe(true);
    expect(component.upgradeError).toBe('');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should handle error response from upgradeToPremium', () => {
    console.error = jest.fn();

    component.upgradeForm.patchValue({
      paymentMethod: 'Visa',
      cardNumber: '1234567812345678',
      securityNumber: '123',
    });

    mockAuthService.getDecodedUser.mockReturnValue({ id: 'userId' });
    mockAuthService.upgradeToPremium.mockReturnValue(
      throwError(() => new Error('Error desde backend'))
    );

    component.onSubmit();

    expect(component.upgradeSuccess).toBe(false);
    expect(component.upgradeError).toBe('Error desde backend');
    expect(console.error).toHaveBeenCalledWith('Error en upgrade', expect.any(Error));
  });
});
