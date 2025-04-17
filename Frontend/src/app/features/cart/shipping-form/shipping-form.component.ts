import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  styleUrls: ['./shipping-form.component.css'],
})
export class ShippingFormComponent {
  shippingForm: FormGroup;

  @Output() shippingDataSubmit = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.shippingForm = this.fb.group({
      cardNumber: ['', Validators.required],
      securityCode: ['', Validators.required],
      expirationDate: ['', Validators.required],
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    });
  }

  submitForm() {
    if (this.shippingForm.valid) {
      this.shippingDataSubmit.emit(this.shippingForm.value);
    }
  }
}
