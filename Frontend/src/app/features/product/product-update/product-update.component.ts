import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductStatus } from '../../../core/models/product/product-status';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-product-update',
  imports: [ReactiveFormsModule, NgFor],
  standalone: true,
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  product!: ProductModel;
  categories = Object.values(ProductCategory);
  subCategories = Object.values(ProductSubCategory);
  statuses = Object.values(ProductStatus);
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe((product) => {
      this.product = product;
      this.initForm();
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: [this.product.name, [Validators.required, Validators.minLength(3)]],
      brand: [this.product.brand, Validators.required],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
      stock: [this.product.stock, [Validators.required, Validators.min(0)]],
      category: [this.product.category, Validators.required],
      subCategory: [this.product.subCategory, Validators.required],
      status: [this.product.status, Validators.required],
      imageUrl: [''] // Se manejará aparte para archivos
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('brand', this.productForm.value.brand);
    formData.append('price', this.productForm.value.price);
    formData.append('stock', this.productForm.value.stock);
    formData.append('category', this.productForm.value.category);
    formData.append('subCategory', this.productForm.value.subCategory);
    formData.append('status', this.productForm.value.status);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }
}

