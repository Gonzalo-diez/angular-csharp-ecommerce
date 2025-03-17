import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductSharedComponent } from "../product-shared/product-shared.component";

@Component({
  selector: 'app-product-category',
  imports: [ProductSharedComponent],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent implements OnInit {
  category: string | null = null;
  categoryProducts: ProductModel[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
      if (this.category) {
        this.getProductsByCategory(this.category);
      }
    });
  }

  getProductsByCategory(category: string): void {
    this.productService.getAllProductsByCategory(category)
      .subscribe({
        next: (data) => {
          this.categoryProducts = data.map((product) => ({
            ...product,
            subCategory: Object.values(ProductSubCategory)[Number(product.subCategory)] as ProductSubCategory,
          }));
        },
        error: (err) => {
          console.error('Error to obtain products by category:', err);
        }
      });
  }
}
