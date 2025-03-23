import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductSharedComponent } from '../product-shared/product-shared.component';

@Component({
  selector: 'app-product-category',
  imports: [ProductSharedComponent, CommonModule, FormsModule],
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
})
export class ProductCategoryComponent implements OnInit {
  category: string | null = null;
  categoryProducts: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];

  minPrice?: number;
  maxPrice?: number;
  productCategory?: ProductCategory;
  productSubCategory?: ProductSubCategory;

  productSubCategories = Object.values(ProductSubCategory);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category');
      if (this.category) {
        this.getProductsByCategory(this.category);
      }
    });
  }

  getProductsByCategory(category: string): void {
    this.productService.getAllProductsByCategory(category).subscribe({
      next: (data) => {
        this.categoryProducts = data.map((product) => ({
          ...product,
          category: Object.values(ProductCategory)[Number(product.category)] as ProductCategory,
          subCategory: Object.values(ProductSubCategory)[
            Number(product.subCategory)
          ] as ProductSubCategory,
        }));

        this.filteredProducts = [...this.categoryProducts];

        // Obtiene las subcategorías de la categoría actual
        this.productSubCategories = this.getSubcategoriesByCategory(
          category as ProductCategory
        );
      },
      error: (err) => {
        console.error('Error to obtain products by category:', err);
      },
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.categoryProducts.filter((product) => {
      return (
        (!this.minPrice || product.price >= this.minPrice) &&
        (!this.maxPrice || product.price <= this.maxPrice) &&
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
      const filteredProducts = this.categoryProducts.filter(
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
        new Set(this.categoryProducts.map((p) => p.subCategory))
      );
    }

    this.productSubCategory = undefined; // Reinicia la selección de subcategoría
  }
}
