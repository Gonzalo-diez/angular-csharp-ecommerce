import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductCategory } from '../../../core/models/product/product-category';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-search.component.html',
})
export class ProductSearchComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  searchQuery: string = '';
  products: any[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      if (this.searchQuery) {
        this.fetchProducts();
      }
    });
  }

  fetchProducts() {
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (data) => {
        this.products = data.map((product) => ({
          ...product,
          category: Object.values(ProductCategory)[
            Number(product.category)
          ] as ProductCategory,
        }))
      },
      error: (error) => console.error('Error to obtain searched product:', error)
    });
  }
}
