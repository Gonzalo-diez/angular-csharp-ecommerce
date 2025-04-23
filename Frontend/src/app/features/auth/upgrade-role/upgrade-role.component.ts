import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upgrade-role',
  templateUrl: './upgrade-role.component.html',
  styleUrl: './upgrade-role.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpgradeRoleComponent {
  upgradeForm: FormGroup;
  upgradeSuccess: boolean = false;
  upgradeError: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.upgradeForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{16}$/)],
      ],
      securityNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{3,4}$/)],
      ],
    });
  }

  onSubmit(): void {
    if (this.upgradeForm.invalid) {
      return;
    }

    const decodedUser = this.authService.getDecodedUser();
    if (!decodedUser || !decodedUser.id) {
      this.upgradeError = 'No se encontró el usuario autenticado';
      return;
    }

    const { paymentMethod, cardNumber, securityNumber } = this.upgradeForm.value;

    this.authService
      .upgradeToPremium(paymentMethod, cardNumber, securityNumber)
      .subscribe({
        next: (res) => {
          this.upgradeSuccess = true;
          this.upgradeError = '';
          console.log('Upgrade exitoso', res);
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.upgradeSuccess = false;
          this.upgradeError = err.message || 'Error en el upgrade';
          console.error('Error en upgrade', err);
        },
      });
  }
}
