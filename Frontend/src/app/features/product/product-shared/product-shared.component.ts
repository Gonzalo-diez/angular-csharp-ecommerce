import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductModel } from '../../../core/models/product/product.model';
import { AuthRole } from '../../../core/models/auth/auth.role';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductService } from '../../../core/services/product/product.service';

@Component({
  selector: 'app-product-shared',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-shared.component.html',
  styleUrl: './product-shared.component.css'
})
export class ProductSharedComponent implements OnInit {
  userId: number | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthService, private productService: ProductService) {}

  @Input() products: ProductModel[] = [];

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (isAuth) {
        const token = this.authService.getToken();
        if (token) {
          this.userId = this.decodeToken(token);
        }
      }
    });
  }

  isAuthenticated() {
    this.authService.isAuthenticated();
  }

  deleteProduct(productId: number, ownerId: number) {
    if (productId === undefined) {
      console.warn('⚠️ Producto sin ID, no se puede eliminar.');
      return;
    }

    if (this.userId !== ownerId && this.userRole !== AuthRole.Admin) {
      console.warn('You dont have the permission to delete this product');
      return;
    }

    this.productService.deleteProduct(productId, Number(this.userId)).subscribe({
      next: () => {
        console.log('✅ Producto eliminado con éxito.');
        this.products = this.products.filter(product => product.id !== productId);
      },
      error: (err) => console.error('❌ Error deleting product:', err)
    })
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
