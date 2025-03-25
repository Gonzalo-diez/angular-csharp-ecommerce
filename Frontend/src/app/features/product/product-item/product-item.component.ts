import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  product: ProductModel | null = null;
  productId!: number;
  isAuth = false;
  userId?: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuth = authStatus;
    })

    // Cargar el producto
    if (this.productId) {
      this.loadProductById();
    }
  }

  loadProductById(): void {
    this.productService.getProductById(this.productId, this.userId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }

  isAuthenticated() {
    this.authService.isAuthenticated();
  }
}
