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
    // Obtener el ID del producto desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Verificar autenticación
    this.authService.isAuthenticated().subscribe((isAuth) => {
      this.isAuth = isAuth; // Asigna el estado de autenticación
      if (isAuth) {
        const token = this.authService.getToken();
        if (token) {
          this.userId = this.decodeToken(token);
        }
      }
    });

    // Cargar el producto
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

  isAuthenticated() {
    this.authService.isAuthenticated();
  }

  addProductToCart() {
    console.log('Intentando agregar producto al carrito'); // Debug

    console.log(this.product?.id);

    console.log(this.userId);

    if (this.product && this.userId) {
      console.log(
        `UserId: ${this.userId}, ProductId: ${this.product.id}, Quantity: ${this.quantity}`
      ); // Debug

      this.cartService
        .addProductToCart(this.userId, Number(this.product.id), this.quantity)
        .subscribe({
          next: (cart) => console.log('Producto agregado al carrito', cart),
          error: (err) =>
            console.error('Error al agregar producto al carrito:', err),
        });
    } else {
      console.error('Error: producto o userId no definidos'); // Debug
    }
  }

  private decodeToken(token: string): number | null {
    try {
      const base64Url = token.split('.')[1]; // Extrae la parte del payload del JWT
      if (!base64Url) return null;

      const payload = JSON.parse(atob(base64Url)); // Decodifica el payload
      console.log('Payload:', payload);

      // Verifica si existe la propiedad "user" y conviértela en objeto
      const userData = payload.user ? JSON.parse(payload.user) : null;
      console.log('User Data:', userData);

      // Extrae el ID si existe
      const id = userData?.Id ?? null;
      console.log('Id:', id);

      return id;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
