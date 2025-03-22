import { Component, Input } from '@angular/core';
import { ProductModel } from '../../../core/models/product/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-shared',
  imports: [CommonModule],
  templateUrl: './product-shared.component.html',
  styleUrl: './product-shared.component.css'
})
export class ProductSharedComponent {
  @Input() products: ProductModel[] = [];
}
