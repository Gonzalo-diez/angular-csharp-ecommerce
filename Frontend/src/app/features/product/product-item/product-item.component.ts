import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { NgClass, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  imports: [NgClass],
  standalone: true,
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  product: ProductModel | null = null;
  productId!: number;
  userId?: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: any // Inyección para detectar si es navegador o SSR
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.userId = Number(localStorage.getItem('userId')) || undefined;
    }

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
}
