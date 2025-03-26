import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductSharedComponent } from '../product-shared/product-shared.component';

@Component({
  selector: 'app-product-list',
  imports: [ProductSharedComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];

  minPrice?: number;
  maxPrice?: number;
  productCategory?: ProductCategory;
  productSubCategory?: ProductSubCategory;

  productCategories = Object.values(ProductCategory);
  productSubCategories: ProductSubCategory[] = [];

  allSubCategories = Object.values(ProductSubCategory);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map((product) => ({
          ...product,
          category: Object.values(ProductCategory)[
            Number(product.category)
          ] as ProductCategory,
          subCategory: Object.values(ProductSubCategory)[
            Number(product.subCategory)
          ] as ProductSubCategory,
        }));
        this.filteredProducts = [...this.products];
      },
      error: (err) => console.error('Error to obtain products list:', err),
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      return (
        (!this.minPrice || product.price >= this.minPrice) &&
        (!this.maxPrice || product.price <= this.maxPrice) &&
        (!this.productCategory || product.category === this.productCategory) &&
        (!this.productSubCategory ||
          product.subCategory === this.productSubCategory)
      );
    });
  }

  getSubcategoriesByCategory(category: ProductCategory): ProductSubCategory[] {
    const subcategoriesMap: Record<ProductCategory, ProductSubCategory[]> = {
      [ProductCategory.Technology]: [
        ProductSubCategory.Console,
        ProductSubCategory.Smartphone,
        ProductSubCategory.PC,
      ],
      [ProductCategory.Clothing]: [
        ProductSubCategory.Men,
        ProductSubCategory.Women,
        ProductSubCategory.Kids,
      ],
      [ProductCategory.Home]: [
        ProductSubCategory.Furniture,
        ProductSubCategory.Kitchen,
        ProductSubCategory.Decor,
      ],
    };

    return subcategoriesMap[category] || [];
  }

  updateSubcategories(): void {
    if (this.productCategory) {
      // Filtra los productos que pertenecen a la categoría seleccionada
      const filteredProducts = this.products.filter(
        (p) => p.category === this.productCategory
      );

      // Si hay productos en esa categoría, extrae las subcategorías
      if (filteredProducts.length > 0) {
        this.productSubCategories = Array.from(
          new Set(filteredProducts.map((p) => p.subCategory))
        );
      } else {
        // Si no hay productos en la categoría seleccionada, mostramos las subcategorías predeterminadas
        this.productSubCategories = this.getSubcategoriesByCategory(
          this.productCategory
        );
      }
    } else {
      // Si no hay categoría seleccionada, muestra todas las subcategorías disponibles
      this.productSubCategories = Array.from(
        new Set(this.products.map((p) => p.subCategory))
      );
    }

    this.productSubCategory = undefined; // Reinicia la selección de subcategoría
  }
}
