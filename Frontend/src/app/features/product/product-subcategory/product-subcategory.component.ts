import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../../../core/models/product/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductSharedComponent } from "../product-shared/product-shared.component";

@Component({
  selector: 'app-product-subcategory',
  imports: [ProductSharedComponent],
  templateUrl: './product-subcategory.component.html',
  styleUrl: './product-subcategory.component.css',
})
export class ProductSubcategoryComponent implements OnInit {
  category: string | null = null;
  subcategory: string | null = null;
  subcategoryProducts: ProductModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
      this.subcategory = params.get('subcategory');
      if (this.category && this.subcategory) {
        this.getProductsBySubCategory(this.category, this.subcategory);
      }
    });
  }

  getProductsBySubCategory(category: string, subcategory: string): void {
    this.productService
      .getAllProductsBySubCategory(category, subcategory)
      .subscribe({
        next: (data) => {
          this.subcategoryProducts = data.map((product) => ({
            ...product,
          }));
        },
        error: (err) => {
          console.error('Error to obtain products in subcategory:', err);
        },
      });
  }
}
