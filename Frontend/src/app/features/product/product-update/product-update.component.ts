import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product/product.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductModel } from '../../../core/models/product/product.model';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  userId: number | null = null;
  productForm!: FormGroup;
  selectedImage?: File;
  productId!: number;
  product?: ProductModel;

  categories = ['Technology', 'Clothing', 'Home'];

  subcategoriesMap: { [key: string]: string[] } = {
    Technology: ['PC', 'Console', 'Smartphone'],
    Clothing: ['Men', 'Women', 'Kids'],
    Home: ['Furniture', 'Kitchen', 'Decor'],
  };

  subcategories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se obtiene el userId del usuario a traves del authService
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        this.userId = this.decodeToken(token);
      }
    }

    // En caso de que el userId no sea el que creo el producto lo envia al inicio
    if (this.userId != this.product?.ownerId) {
      this.router.navigate(['/']);
    }

    this.productId = Number(this.route.snapshot.paramMap.get('id'));  

    // Inicializar formulario con valores predeterminados para evitar errores
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      subCategory: [''],
      status: ['Enable']
    });

    // Detectar cambios en la categoría y actualizar subcategorías
    this.productForm.get('category')?.valueChanges.subscribe((category) => {
      if (category) {
        this.subcategories = this.subcategoriesMap[category] || [];
        // Solo borrar subCategory si el usuario cambió la categoría
        if (this.product?.category !== category) {
          this.productForm.patchValue({ subCategory: '' });
        }
      }
    });    

    // Obtener el producto desde el servicio
    this.productService.getProductById(this.productId).pipe(
      catchError((error) => {
        console.error('Error al obtener el producto:', error);
        return of(null);
      })
    ).subscribe((product) => {
      if (product) {
        this.product = product;
        this.initForm(product);
      }
    });
  }

  initForm(product: ProductModel): void {
    this.productForm.setValue({
      name: product.name || '',
      brand: product.brand || '',
      price: product.price ?? 0,
      stock: product.stock ?? 0,
      category: product.category || '',
      subCategory: product.subCategory || '',
      status: product.status || 'Enable'
    });
  
    // Asegurar que la categoría se setea antes de escuchar cambios
    this.subcategories = this.subcategoriesMap[product.category] || [];
  
    // Asegurar que el formulario tenga el subCategory correcto si es necesario
    this.productForm.patchValue({ subCategory: product.subCategory || '' });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  updateProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData: Partial<ProductModel> = this.productForm.value;

    this.productService.updateProduct(this.productId, productData, this.selectedImage).subscribe({
      next: () => {
        alert('Producto actualizado correctamente');
        this.router.navigate(['/']);
      },
      error: (error) => console.error('Error al actualizar el producto:', error)
    });
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
