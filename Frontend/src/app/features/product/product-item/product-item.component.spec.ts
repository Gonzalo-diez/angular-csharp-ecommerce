import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductItemComponent } from './product-item.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product/product.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductStatus } from '../../../core/models/product/product-status';
import { CartModel } from '../../../core/models/cart/cart.model';
import { AuthRole } from '../../../core/models/auth/auth.role';

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockCartService: jest.Mocked<CartService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockProductService = {
      getProductById: jest.fn(),
    } as any;

    mockAuthService = {
      isAuthenticated: jest.fn(),
      getToken: jest.fn(),
    } as any;

    mockCartService = {
      addProductToCart: jest.fn(),
    } as any;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductItemComponent, CommonModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el producto correctamente', () => {
    const mockProduct: ProductModel = {
      id: 1,
      name: 'Producto de prueba',
      brand: 'test',
      price: 100,
      imageUrl: 'test.png',
      category: ProductCategory.Technology,
      subCategory: ProductSubCategory.PC,
      stock: 10,
      status: ProductStatus.Enable
    };
  
    // Mockea la respuesta del service
    mockProductService.getProductById.mockReturnValue(of(mockProduct));
  
    // Establece productId en el componente manualmente
    component.productId = mockProduct.id!;
  
    // Ejecuta el método
    component.loadProductById();
  
    // Verifica que se haya llamado correctamente con el id correcto
    expect(mockProductService.getProductById).toHaveBeenCalledWith(mockProduct.id);
  
    // Verifica que haya guardado correctamente el producto
    expect(component.product).toEqual(mockProduct);
  });
  
  it('debería manejar error al cargar producto', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockProductService.getProductById.mockReturnValue(throwError(() => 'Error'));

    component.loadProductById();

    expect(consoleSpy).toHaveBeenCalledWith('Error loading product:', 'Error');

    consoleSpy.mockRestore();
  });

  it('debería agregar producto al carrito', () => {
    const mockCart: CartModel = { 
      id: 1,
      userId: 1,
      user: {
        id: 1,
        firstName: 'user',
        lastName: 'example',
        email: 'user@example.com',
        password: 'password123456',
        products: null,
        purchases: null,
        role: AuthRole.Premium,
        imageAvatar: 'avatar.png'
      },
      items: [],
      createdAt: '2024-04-30T12:00:00Z',
     };
    mockCartService.addProductToCart.mockReturnValue(of(mockCart));
    component.product = {
      id: 1,
      name: 'Producto de prueba',
      brand: 'test',
      price: 100,
      imageUrl: 'test.png',
      category: ProductCategory.Technology,
      subCategory: ProductSubCategory.PC,
      stock: 10,
      status: ProductStatus.Enable
    };
    component.userId = 123;

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    component.addProductToCart();

    expect(mockCartService.addProductToCart).toHaveBeenCalledWith(1, 1);
    expect(consoleSpy).toHaveBeenCalledWith('✅ Producto agregado al carrito', mockCart);

    consoleSpy.mockRestore();
  });

  it('debería mostrar error si no hay producto o userId', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    component.addProductToCart();

    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Error: producto o userId no definidos');

    consoleSpy.mockRestore();
  });

  it('debería decodificar correctamente el token', () => {
    const payload = {
      user: JSON.stringify({ Id: 456 }),
    };
    const base64Payload = btoa(JSON.stringify(payload));
    const token = `header.${base64Payload}.signature`;

    const userId = component['decodeToken'](token);

    expect(userId).toBe(456);
  });

  it('debería devolver null si el token no tiene payload válido', () => {
    const token = 'invalid.token.value';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const userId = component['decodeToken'](token);

    expect(userId).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
