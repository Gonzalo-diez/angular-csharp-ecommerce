import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product/product.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent implements OnInit {
  userId: number | null = null;
  productForm: FormGroup;
  categories = ['Technology', 'Clothing', 'Home'];
  subcategoriesMap: { [key: string]: string[] } = {
    Technology: ['PC', 'Console', 'Smartphone'],
    Clothing: ['Men', 'Women', 'Kids'],
    Home: ['Furniture', 'Kitchen', 'Decor'],
  };

  subcategories: string[] = [];

  constructor(private fb: FormBuilder, private productService: ProductService, private authService: AuthService) {
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
      this.productForm.patchValue({ subCategory: '' });
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        this.userId = this.decodeToken(token);
      }
    }
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
  
      const image = formValue.image;
  
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

  private decodeToken(token: string): number | null {
    try {
      const base64Url = token.split('.')[1]; // Extrae la parte del payload del JWT
      if (!base64Url) return null;

      const payload = JSON.parse(atob(base64Url)); // Decodifica el payload

      // Verifica si existe la propiedad "user" y conviértela en objeto
      const userData = payload.user ? JSON.parse(payload.user) : null;

      // Extrae el ID si existe
      const id = userData?.Id ?? null;

      return id;
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
