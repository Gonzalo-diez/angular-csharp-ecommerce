import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { CartModel } from '../../core/models/cart/cart.model';
import { CartItemModel } from '../../core/models/cart/cart-item.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { InvoiceModel } from '../../core/models/invoice/invoice.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: CartModel | null = null;
  userId: number | null = null;
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        const token = this.authService.getToken();
        if (token) {
          this.userId = this.decodeToken(token);
          if (this.userId) {
            this.loadCart();
          }
        }
      }
    });
  }

  loadCart(): void {
    if (!this.userId) return;
    this.cartService.getCart(this.userId).subscribe({
      next: (cartData) => {
        this.cart = cartData;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar el carrito.';
      },
    });
  }

  clearCart(): void {
    if (!this.userId) return;
    this.cartService.clearCart(this.userId).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart ?? {
          id: 0,
          userId: this.userId,
          items: [],
          createdAt: '',
        };
      },
      error: () => {
        this.errorMessage = 'Error al vaciar el carrito.';
      },
    });
  }

  removeItem(cartItem: CartItemModel): void {
    if (!this.userId) return;
    this.cartService.removeFromCart(this.userId, cartItem).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart ?? {
          id: 0,
          userId: this.userId,
          items: [],
          createdAt: '',
        };
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el producto.';
      },
    });
  }

  getTotal(): number {
    return this.cart?.items.reduce(
      (total, item) =>
        total + (item.quantity ?? 0) * (item.product?.price ?? 0),
      0
    ) as number;
  }

  checkout(): void {
    if (!this.userId || !this.cart) return;
    this.cartService.checkout(this.userId, this.cart).subscribe({
      next: (invoice) => {
        console.log('Compra realizada:', invoice);
        this.cart = null;
      },
      error: () => {
        this.errorMessage = 'Error en el proceso de compra.';
      },
    });
  }

  private decodeToken(token: string): number | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error('Formato de token inválido');
        return null;
      }

      const payload = JSON.parse(atob(base64Url));

      // Extraer userId correctamente
      if (payload.user) {
        const userObject = JSON.parse(payload.user);
        return userObject.Id || null;
      }

      return null;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
