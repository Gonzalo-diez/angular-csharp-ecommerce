import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductModel } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:5169/api/product'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los productos con filtros opcionales
  getAllProducts(
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    subCategory?: string
  ): Observable<ProductModel[]> {
    let params: any = {};
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (category) params.category = category;
    if (subCategory) params.subCategory = subCategory;

    return this.http.get<ProductModel[]>(this.apiUrl, { params });
  }

  // Obtener un producto por ID
  getProductById(id: number, userId?: number): Observable<ProductModel> {
    let params: any = {};
    if (userId) params.userId = userId;

    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`, { params });
  }

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
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleErrorCategory(error, category)
        )
      );
  }

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
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.handleErrorSubCategory(error, category, subCategory)
        )
      );
  }

  // Agregar un producto (requiere autenticación)
  addProduct(product: ProductModel, image?: File): Observable<ProductModel> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    formData.append('category', product.category);
    formData.append('subCategory', product.subCategory);
    formData.append('status', product.status);

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<ProductModel>(`${this.apiUrl}/add`, formData, {
      headers: this.getAuthHeaders(true),
    });
  }

  updateProduct(
    id: number,
    productData: Partial<ProductModel>,
    image?: File
  ): Observable<ProductModel> {
    const formData = new FormData();
  
    // Agregar todos los datos de productData dinámicamente
    Object.keys(productData).forEach((key) => {
      const value = productData[key as keyof ProductModel];
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
  
    // Agregar la imagen si existe
    if (image) {
      formData.append('image', image);
    }
  
    return this.http.put<ProductModel>(`${this.apiUrl}/${id}`, formData, {
      headers: this.getAuthHeaders(true), // Asegúrate de que no incluya 'Content-Type' para FormData
    });
  }  

  // Eliminar un producto (requiere autenticación)
  deleteProduct(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Obtener el token del usuario
  private getToken(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('token')
      : null;
  }

  // Obtener headers con autorización
  private getAuthHeaders(isMultipart: boolean = false): HttpHeaders {
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    if (isMultipart) {
      headers = headers.set('enctype', 'multipart/form-data');
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  private handleErrorCategory(error: HttpErrorResponse, category?: string) {
    if (error.status === 404) {
      console.error(
        `No se encontraron productos para la categoría '${category}'`
      );
      return throwError(
        () => new Error(`No hay productos disponibles en esta categoría`)
      );
    }
    console.error('Ocurrió un error:', error);
    return throwError(
      () => new Error('Algo salió mal, intenta nuevamente más tarde.')
    );
  }

  private handleErrorSubCategory(
    error: HttpErrorResponse,
    category?: string,
    subCategory?: string
  ) {
    if (error.status === 404) {
      console.error(
        `No se encontraron productos para la categoría '${category}' y subcategoría '${
          subCategory || 'N/A'
        }'.`
      );
      return throwError(
        () =>
          new Error(
            `No hay productos disponibles en esta categoría o subcategoría.`
          )
      );
    }
    console.error('Ocurrió un error:', error);
    return throwError(
      () => new Error('Algo salió mal, intenta nuevamente más tarde.')
    );
  }
}
