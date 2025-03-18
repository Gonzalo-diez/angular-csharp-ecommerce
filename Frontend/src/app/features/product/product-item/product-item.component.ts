import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { NgClass } from '@angular/common';

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
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Obtener el userId si el usuario está logueado
    this.userId = Number(localStorage.getItem('userId')) || undefined;

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
