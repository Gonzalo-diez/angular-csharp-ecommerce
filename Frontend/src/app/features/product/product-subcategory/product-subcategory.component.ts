import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductSharedComponent } from '../product-shared/product-shared.component';
import { ProductCategory } from '../../../core/models/product/product-category';

@Component({
  selector: 'app-product-subcategory',
  imports: [ProductSharedComponent, CommonModule, FormsModule],
  templateUrl: './product-subcategory.component.html',
  styleUrl: './product-subcategory.component.css',
})
export class ProductSubcategoryComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showFilters = false;
  category: string | null = null;
  subcategory: string | null = null;
  subcategoryProducts: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];

  minPrice?: number;
  maxPrice?: number;

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
            category: Object.values(ProductCategory)[Number(product.category)] as ProductCategory,
          }));

          this.filteredProducts = [...this.subcategoryProducts];
        },
        error: (err) => {
          console.error('Error to obtain products in subcategory:', err);
        },
      });
  }
  
  filterProducts(): void {
    this.filteredProducts = this.subcategoryProducts.filter((product) => {
      return (
        (!this.minPrice || product.price >= this.minPrice) &&
        (!this.maxPrice || product.price <= this.maxPrice)
      );
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get paginatedProducts(): ProductModel[] {
    const startIndex = (this.currentPage -1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
