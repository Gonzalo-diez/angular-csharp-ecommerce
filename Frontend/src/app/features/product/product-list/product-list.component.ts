import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductSharedComponent } from "../product-shared/product-shared.component";

@Component({
  selector: 'app-product-list',
  imports: [ProductSharedComponent],
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map((product) => ({
          ...product,
          category: Object.values(ProductCategory)[Number(product.category)] as ProductCategory,
          subCategory: Object.values(ProductSubCategory)[Number(product.subCategory)] as ProductSubCategory,
        }));
      },
      error: (err) => console.error('Error to obtain products list:', err),
    });
  }
}
