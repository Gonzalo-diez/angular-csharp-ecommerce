import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { SessionService } from '../../../core/services/session/session.service';
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
  sessionId?: string;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del producto desde la URL
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    // Obtener el userId si el usuario está logueado
    this.userId = Number(localStorage.getItem('userId')) || undefined;

    // Obtener sessionId para usuarios no logueados
    this.sessionId = this.sessionService.getSessionId() || undefined;

    // Cargar el producto
    if (this.productId) {
      this.loadProductById();
    }
  }

  loadProductById(): void {
    this.productService.getProductById(this.productId, this.userId, this.sessionId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (err) => console.error('Error loading product:', err)
    });
  }
}
