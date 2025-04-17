import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  product: ProductModel | null = null;
  productId!: number;
  isAuth = false;
  quantity: number = 1;
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📦 Product ID:', this.productId); // 🔍 Log del productId

    this.isAuth = this.authService.isAuthenticated();

    if (this.isAuth) {
      const token = this.authService.getToken();
      console.log('🔑 Token:', token); // 🔍 Log del token

      if (token) {
        this.userId = this.decodeToken(token);
        console.log('👤 User ID:', this.userId); // 🔍 Log del userId
      }
    }

    if (this.productId) {
      this.loadProductById();
    }
  }

  loadProductById(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => console.error('Error loading product:', err),
    });
  }

  addProductToCart() {
    if (this.product && this.userId) {
      this.cartService
        .addProductToCart(Number(this.product.id), this.quantity)
        .subscribe({
          next: (cart) => console.log('✅ Producto agregado al carrito', cart),
          error: (err) => console.error('❌ Error al agregar producto:', err),
        });
    } else {
      console.error('⚠️ Error: producto o userId no definidos');
    }
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
