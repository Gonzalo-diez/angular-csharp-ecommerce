import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ProductModel } from '../../models/product/product.model';
import { ProductCategory } from '../../models/product/product-category';
import { ProductSubCategory } from '../../models/product/product-sub-category';
import { ProductStatus } from '../../models/product/product-status';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: ProductModel = {
    id: 1,
    name: 'Producto Test',
    brand: 'test',
    status: ProductStatus.Enable,
    price: 100,
    stock: 10,
    category: ProductCategory.Technology,
    subCategory: ProductSubCategory.PC,
    imageUrl: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener todos los productos', () => {
    service.getAllProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0]).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:5169/api/product');
    expect(req.request.method).toBe('GET');
    req.flush([mockProduct]);
  });

  it('debería buscar productos por query', () => {
    const query = 'test';
    service.searchProducts(query).subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Producto Test');
    });

    const req = httpMock.expectOne(`http://localhost:5169/api/product/search?query=${query}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockProduct]);
  });

  it('debería obtener un producto por ID', () => {
    service.getProductById(1).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:5169/api/product/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('debería agregar un producto', () => {
    const mockFormData = new FormData();
    mockFormData.append('name', mockProduct.name);
    mockFormData.append('price', mockProduct.price.toString());

    service.addProduct(mockProduct).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:5169/api/product/add');
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('debería actualizar un producto', () => {
    const updateData = { name: 'Producto Actualizado' };

    service.updateProduct(1, updateData).subscribe((product) => {
      expect(product.name).toBe('Producto Actualizado');
    });

    const req = httpMock.expectOne('http://localhost:5169/api/product/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockProduct, ...updateData });
  });

  it('debería eliminar un producto', () => {
    service.deleteProduct(1).subscribe((res) => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne('http://localhost:5169/api/product/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
