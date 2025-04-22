import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SignalService } from '../../../core/services/signal/signal.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  authForm: FormGroup;
  isAuth = false;

  constructor(
    private authService: AuthService,
    private signalService: SignalService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.authForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      image: [null]
    })
  }

  ngOnInit(): void {
    // isAuthenticated() ya devuelve un booleano
    this.signalService.startConnections();
    this.isAuth = this.authService.isAuthenticated();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.authForm.patchValue({ image: file })
  }

  register(): void {
    if (this.authForm.valid) {
      const formValue = this.authForm.value;
      const user = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        imageAvatar: formValue.image
      }

      const image = formValue.image;

      this.authService.register(user.firstName, user.lastName, user.email, user.password, image).subscribe(
        (response) => {
          console.log('Usuario creado:', response);
          this.isAuth =  this.authService.isAuthenticated();
          const user = this.authService.getDecodedUser();
          this.signalService.sendRegisterNotification(user);
          this.router.navigateByUrl('/');
        },
        (error) => {
          console.error('Error al agregar usuario:', error);
        }
      );
    } else {
      console.log('Formulario inválido')
    }
  }
}
