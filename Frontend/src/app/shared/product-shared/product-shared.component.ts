import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductModel } from '../../core/models/product/product.model';
import { AuthRole } from '../../core/models/auth/auth.role';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductService } from '../../core/services/product/product.service';

@Component({
  selector: 'app-product-shared',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-shared.component.html',
  styleUrl: './product-shared.component.css',
})
export class ProductSharedComponent implements OnInit {
  userId: number | null = null;
  userRole: string | null = null;

  @Input() products: ProductModel[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        const decoded = this.authService.getDecodedUser();
        this.userId = decoded?.id ? Number(decoded.id) : null;
        this.userRole = decoded?.role || null;
      }
    }
  }

  canAddProduct(): boolean {
    return this.userRole === AuthRole.Premium;
  }

  goToAddProduct(): void {
    if (this.canAddProduct()) {
      this.router.navigate(['/product/add']);
    } else {
      console.warn('🚫 No tienes permisos para agregar productos.');
    }
  }

  goToUpdateProduct(productId: number, ownerId: number) {
    if (!productId) {
      console.warn('⚠️ Producto sin ID, no se puede editar.');
      return;
    }

    if (this.userId !== ownerId) {
      console.warn('🚫 No tienes permisos para editar este producto.');
      return;
    }

    this.router.navigate([`/product/update/${productId}`]);
  }

  deleteProduct(productId: number) {
    if (!productId) {
      console.warn('⚠️ Producto sin ID, no se puede eliminar.');
      return;
    }

    this.productService
      .deleteProduct(productId)
      .subscribe({
        next: () => {
          console.log('✅ Producto eliminado con éxito.');
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
        },
        error: (err) => console.error('❌ Error eliminando producto:', err),
      });
  }
}
