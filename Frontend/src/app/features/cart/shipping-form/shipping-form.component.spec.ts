import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShippingFormComponent } from './shipping-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ShippingFormComponent with Jest', () => {
  let component: ShippingFormComponent;
  let fixture: ComponentFixture<ShippingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.shippingForm.valid).toBe(false);
  });

  it('should validate form fields correctly', () => {
    const form = component.shippingForm;

    form.controls['cardNumber'].setValue('');
    form.controls['securityCode'].setValue('');
    form.controls['expirationDate'].setValue('');
    form.controls['fullName'].setValue('');
    form.controls['address'].setValue('');
    form.controls['city'].setValue('');
    form.controls['zipCode'].setValue('abcde');
    form.controls['phone'].setValue('123');

    expect(form.valid).toBe(false);

    form.controls['cardNumber'].setValue('1234567890123456');
    form.controls['securityCode'].setValue('123');
    form.controls['expirationDate'].setValue('12/25');
    form.controls['fullName'].setValue('Juan Pérez');
    form.controls['address'].setValue('Av. Siempre Viva 742');
    form.controls['city'].setValue('Springfield');
    form.controls['zipCode'].setValue('12345');
    form.controls['phone'].setValue('1234567890');

    expect(form.valid).toBe(true);
  });

  it('should emit shippingDataSubmit event with form data when valid', () => {
    const emitSpy = jest.spyOn(component.shippingDataSubmit, 'emit');

    const form = component.shippingForm;
    form.controls['cardNumber'].setValue('1234567890123456');
    form.controls['securityCode'].setValue('123');
    form.controls['expirationDate'].setValue('12/25');
    form.controls['fullName'].setValue('Juan Pérez');
    form.controls['address'].setValue('Av. Siempre Viva 742');
    form.controls['city'].setValue('Springfield');
    form.controls['zipCode'].setValue('12345');
    form.controls['phone'].setValue('1234567890');

    component.submitForm();

    expect(emitSpy).toHaveBeenCalledWith(form.value);
  });

  it('should not emit event if form is invalid', () => {
    const emitSpy = jest.spyOn(component.shippingDataSubmit, 'emit');

    component.submitForm();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
