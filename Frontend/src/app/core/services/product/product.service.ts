import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductModel } from '../../models/product/product.model';
import { ProductCategory } from '../../models/product/product-category';
import { ProductSubCategory } from '../../models/product/product-sub-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5169/api/product';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos con filtros opcionales
  getAllProducts(
    minPrice?: number,
    maxPrice?: number,
    category?: ProductCategory,
    subCategory?: ProductSubCategory
  ): Observable<ProductModel[]> {
    let params: any = {};
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;

    return this.http
      .get<ProductModel[]>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  // Obtener un producto por ID
  getProductById(id: number, userId?: number): Observable<ProductModel> {
    let params: any = {};
    if (userId) params.userId = userId;

    return this.http
      .get<ProductModel>(`${this.apiUrl}/${id}`, { params })
      .pipe(catchError(this.handleError));
  }

  // Obtener productos por categoría
  getAllProductsByCategory(
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    subCategory?: string
  ): Observable<ProductModel[]> {
    let params: any = {};
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (subCategory) params.subCategory = subCategory;

    return this.http
      .get<ProductModel[]>(`${this.apiUrl}/category/${category}`, { params })
      .pipe(catchError(this.handleError));
  }

  // Obtener productos por subcategoría
  getAllProductsBySubCategory(
    category?: string,
    subCategory?: string,
    minPrice?: number,
    maxPrice?: number
  ): Observable<ProductModel[]> {
    let params: any = {};
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    return this.http
      .get<ProductModel[]>(
        `${this.apiUrl}/category/${category}/subcategory/${subCategory}`,
        { params }
      )
      .pipe(catchError(this.handleError));
  }

  // Agregar un producto (requiere autenticación)
  addProduct(product: ProductModel, image?: File): Observable<ProductModel> {
    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      const value = product[key as keyof ProductModel];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (image) formData.append('image', image);

    return this.http
      .post<ProductModel>(`${this.apiUrl}/add`, formData)
      .pipe(catchError(this.handleError));
  }

  // Actualizar un producto (requiere autenticación)
  updateProduct(
    id: number,
    productData: Partial<ProductModel>,
    image?: File
  ): Observable<ProductModel> {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      const value = productData[key as keyof ProductModel];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (image) formData.append('image', image);

    return this.http
      .put<ProductModel>(`${this.apiUrl}/${id}`, formData)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un producto (requiere autenticación)
  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    return throwError(
      () => new Error('Algo salió mal, intenta nuevamente más tarde.')
    );
  }
}
