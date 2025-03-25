import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductModel } from '../../../core/models/product/product.model';

@Component({
  selector: 'app-product-shared',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-shared.component.html',
  styleUrl: './product-shared.component.css'
})
export class ProductSharedComponent {
  @Input() products: ProductModel[] = [];
}
