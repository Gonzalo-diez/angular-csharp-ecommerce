import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { SignalService } from '../../core/services/signal/signal.service';
import { CartModel } from '../../core/models/cart/cart.model';
import { CartItemModel } from '../../core/models/cart/cart-item.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { InvoiceModel } from '../../core/models/invoice/invoice.model';
import { CheckoutRequestModel } from '../../core/models/invoice/checkout-request.model';
import { ShippingFormComponent } from './shipping-form/shipping-form.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CommonModule, ShippingFormComponent],
  standalone: true,
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: CartModel = {
    id: 0,
    userId: 0,
    items: [],
    createdAt: '',
  };
  userId: number | null = null;
  errorMessage: string = '';
  paymentMethod: string = ''; // Método de pago seleccionado
  showModal: boolean = false; // Modal de pago
  showShippingForm: boolean = false; // Muestra el formulario de envío

  // Datos del formulario de envío
  shippingData = {
    cardNumber: '',
    securityCode: '',
    expirationDate: new Date('2025-08-31'),
    fullName: '',
    city: '',
    address: '',
    zipCode: '',
    phone: '',
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private signalService: SignalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signalService.startConnections();

    // Suscribirse a cambios en el carrito en tiempo real
    this.signalService.cartUpdates$.subscribe((cart) => {
      if (cart) {
        console.log('🛒 Carrito actualizado:', cart);
        this.cart = cart;
      }
    });

    // 🔥 Ahora `isAuthenticated()` devuelve un booleano, no un Observable
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        this.userId = this.decodeToken(token);
        if (this.userId) {
          this.loadCart();
        }
      }
    }
  }

  loadCart(): void {
    if (!this.userId) return;
    this.cartService.getCart().subscribe({
      next: (cartData) => {
        this.cart = cartData;
      },
      error: () => {
        this.errorMessage = 'Error al cargar el carrito.';
      },
    });
  }

  removeItem(cartItem: CartItemModel): void {
    if (!this.userId) return;
    this.cartService.removeFromCart(cartItem).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart ?? {
          id: 0,
          userId: this.userId,
          items: [],
          createdAt: '',
        };
        this.signalService.sendUpdate(Number(this.userId), this.cart);
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el producto.';
      },
    });
  }

  getTotal(): number {
    return (
      this.cart?.items?.reduce(
        (total, item) =>
          total + (item.quantity ?? 0) * (item.product?.price ?? 0),
        0
      ) ?? 0
    );
  }

  openPaymentModal(): void {
    this.showModal = true;
  }

  closePaymentModal(): void {
    this.showModal = false;
  }

  confirmPayment(method: string): void {
    this.paymentMethod = method;
    this.showModal = false;
    this.showShippingForm = true; // Mostrar formulario de envío
  }

  onShippingDataSubmit(shippingData: any): void {
    this.shippingData = shippingData;
    this.completeCheckout();
  }

  completeCheckout(): void {
    if (!this.userId || !this.cart || !this.paymentMethod) {
      console.error('❌ Faltan datos para completar la compra.');
      return;
    }

    const checkoutRequest: CheckoutRequestModel = {
      paymentMethod: this.paymentMethod,
      shippingData: this.shippingData,
    };

    this.cartService.checkout(checkoutRequest).subscribe({
      next: (invoice: InvoiceModel) => {
        console.log('✅ Compra realizada. Factura generada:', invoice);

        // Vaciar carrito tras la compra
        this.cart = {
          id: 0,
          userId: Number(this.userId),
          items: [],
          createdAt: '',
        };
        this.signalService.sendUpdate(Number(this.userId), this.cart);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = '❌ Error en el proceso de compra.';
      },
    });
  }

  private decodeToken(token: string): number | null {
    try {
      const base64Url = token.split('.')[1]; // Extrae la parte del payload del JWT
      if (!base64Url) return null;

      const payload = JSON.parse(atob(base64Url)); // Decodifica el payload

      // Verifica si existe la propiedad "user" y conviértela en objeto
      const userData = payload.user ? JSON.parse(payload.user) : null;

      // Extrae el ID si existe
      const id = userData?.Id ?? null;

      return id;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
