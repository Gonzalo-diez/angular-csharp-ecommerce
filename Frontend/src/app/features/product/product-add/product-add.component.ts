import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent {
  productForm: FormGroup;

  categories = ['Technology', 'Clothing', 'Home'];

  subcategoriesMap: { [key: string]: string[] } = {
    Technology: ['PC', 'Console', 'Smartphone'],
    Clothing: ['Men', 'Women', 'Kids'],
    Home: ['Furniture', 'Kitchen', 'Decor'],
  };

  subcategories: string[] = [];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      subCategory: [''],
      status: ['Enable', Validators.required],
      image: [null],
    });

    // Detectar cambios en la categoría y actualizar subcategorías
    this.productForm.get('category')?.valueChanges.subscribe((category) => {
      this.subcategories = this.subcategoriesMap[category] || [];
      this.productForm.patchValue({ subCategory: '' }); // Reset subcategoría
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.productForm.patchValue({ image: file });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const product = {
        name: formValue.name,
        brand: formValue.brand,
        price: formValue.price,
        stock: formValue.stock,
        category: formValue.category,
        subCategory: formValue.subCategory,
        status: formValue.status,
        imageUrl: formValue.image
      };
  
      const image = formValue.image; // Esto ya tiene el archivo seleccionado
  
      console.log('Enviando producto:', product);
  
      this.productService.addProduct(product, image).subscribe(
        (response) => {
          console.log('Producto agregado:', response);
        },
        (error) => {
          console.error('Error al agregar producto:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
  
}
