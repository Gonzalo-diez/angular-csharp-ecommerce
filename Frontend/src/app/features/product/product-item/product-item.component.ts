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
  userId: number | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    
    // 🔥 Ahora `isAuthenticated()` devuelve un boolean directamente
    this.isAuth = this.authService.isAuthenticated();

    if (this.isAuth) {
      const token = this.authService.getToken();
      this.userId = token ? this.decodeToken(token) : null;
    }

    if (this.productId) {
      this.loadProductById();
    }
  }

  loadProductById(): void {
    this.productService
      .getProductById(this.productId, Number(this.userId))
      .subscribe({
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
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;

      const payload = JSON.parse(atob(base64Url));
      return payload?.user?.id ?? null; // 🔹 Asegura que se usa `.id` en lugar de `.Id`
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
