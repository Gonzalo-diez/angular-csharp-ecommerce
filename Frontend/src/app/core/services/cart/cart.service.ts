import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // ✅ Obtener carrito del usuario (retorna `CartModel`)
  getCart(userId: number): Observable<CartModel> {
    return this.http.get<CartModel>(`${this.apiUrl}`, {
      params: new HttpParams().set('userId', userId),
    });
  }

  // ✅ Agregar producto al carrito
  addProductToCart(
    userId: number,
    productId: number,
    quantity: number
  ): Observable<CartModel> {
    const body = { productId, quantity };
    const params = new HttpParams().set('userId', userId);

    return this.http.post<CartModel>(`${this.apiUrl}/add`, body, { params });
  }

  // ✅ Eliminar producto del carrito (recibe `CartItemModel`)
  removeFromCart(
    userId: number,
    cartItem: CartItemModel
  ): Observable<CartModel> {
    return this.http.delete<CartModel>(
      `${this.apiUrl}/remove/${cartItem.productId}`,
      {
        params: new HttpParams().set('userId', userId),
      }
    );
  }

  // ✅ Vaciar carrito (retorna `CartModel` vacío)
  clearCart(userId: number): Observable<CartModel> {
    return this.http.delete<CartModel>(`${this.apiUrl}/clear`, {
      params: new HttpParams().set('userId', userId),
    });
  }

  // ✅ Realizar checkout (retorna `InvoiceModel` con la compra realizada)
  checkout(userId: number, checkoutRequest: CheckoutRequestModel): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(
      `${this.apiUrl}/checkout`,
      checkoutRequest,
      { params: new HttpParams().set('userId', userId) }
    );
  }
  

  // ✅ Obtener compras del usuario (retorna `PurchaseModel[]`)
  getPurchases(userId: number): Observable<PurchaseModel[]> {
    return this.http.get<PurchaseModel[]>(`${this.apiUrl}/purchases`, {
      params: new HttpParams().set('userId', userId),
    });
  }
}
