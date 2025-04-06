import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartModel } from '../../models/cart/cart.model';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { InvoiceModel } from '../../models/invoice/invoice.model';
import { PurchaseModel } from '../../models/purchase/purchase.model';
import { CheckoutRequestModel } from '../../models/invoice/checkout-request.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5169/api/cart';

  constructor(private http: HttpClient) {}

  // ✅ Obtener carrito del usuario
  getCart(): Observable<CartModel> {
    return this.http.get<CartModel>(`${this.apiUrl}`).pipe(catchError(this.handleError));
  }

  // ✅ Agregar producto al carrito
  addProductToCart(productId: number, quantity: number): Observable<CartModel> {
    return this.http.post<CartModel>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Eliminar producto del carrito
  removeFromCart(cartItem: CartItemModel): Observable<CartModel> {
    return this.http.delete<CartModel>(`${this.apiUrl}/remove/${cartItem.productId}`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Vaciar carrito
  clearCart(): Observable<CartModel> {
    return this.http.delete<CartModel>(`${this.apiUrl}/clear`).pipe(catchError(this.handleError));
  }

  // ✅ Realizar checkout
  checkout(checkoutRequest: CheckoutRequestModel): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(`${this.apiUrl}/checkout`, checkoutRequest).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Obtener compras del usuario
  getPurchases(): Observable<PurchaseModel[]> {
    return this.http.get<PurchaseModel[]>(`${this.apiUrl}/purchases`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔥 Manejo de errores global
  private handleError(error: any) {
    console.error('Error en la solicitud HTTP:', error);
    return throwError(() => new Error(error.message || 'Error desconocido'));
  }
}
