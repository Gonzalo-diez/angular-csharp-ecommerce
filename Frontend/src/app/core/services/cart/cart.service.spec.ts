import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartModel } from '../../models/cart/cart.model';
import { InvoiceModel } from '../../models/invoice/invoice.model';
import { PurchaseModel } from '../../models/purchase/purchase.model';
import { CheckoutRequestModel } from '../../models/invoice/checkout-request.model';
import { CartItemModel } from '../../models/cart/cart-item.model';
import { ProductModel } from '../../models/product/product.model';
import { ProductCategory } from '../../models/product/product-category';
import { ProductSubCategory } from '../../models/product/product-sub-category';
import { ProductStatus } from '../../models/product/product-status';
import { AuthRole } from '../../models/auth/auth.role';

describe('CartService', () => {
  let service: CartService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cart data', () => {
    const mockCart: CartModel = {
      id: 1,
      userId: 1,
      items: [],
      createdAt: '2024-04-30T12:00:00Z',
    };

    service.getCart().subscribe((res) => {
      expect(res).toEqual(mockCart);
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/cart');
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should add product to cart', () => {
    const mockCart: CartModel = {
      id: 1,
      userId: 1,
      items: [],
      createdAt: '2024-04-30T12:00:00Z',
    };

    service.addProductToCart(1, 2).subscribe((res) => {
      expect(res).toEqual(mockCart);
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/cart/add');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ productId: 1, quantity: 2 });
    req.flush(mockCart);
  });

  it('should remove product from cart', () => {
    const mockCart: CartModel = {
      id: 1,
      userId: 1,
      items: [],
      createdAt: '2024-04-30T12:00:00Z',
    };

    const mockProduct: ProductModel = {
      id: 1,
      name: 'Product',
      brand: 'Test',
      price: 100,
      status: ProductStatus.Enable,
      category: ProductCategory.Technology,
      subCategory: ProductSubCategory.PC,
      ownerId: 1,
      owner: {
        id: 1,
        firstName: 'test',
        lastName: 'example',
        email: 'test@example.com',
        password: 'password123456',
        role: AuthRole.Premium,
        purchases: null,
        imageAvatar: 'avatar.png'
      },
      stock: 10,
      imageUrl: 'product.png'
    };

    const cartItem: CartItemModel = {
      id: 1,
      cartId: 1,
      productId: 1,
      product: mockProduct,
      quantity: 1
    };

    service.removeFromCart(cartItem).subscribe((res) => {
      expect(res).toEqual(mockCart);
    });

    const req = httpTesting.expectOne(`http://localhost:5169/api/cart/remove/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockCart);
  });

  it('should clear cart', () => {
    const mockCart: CartModel = {
      id: 1,
      userId: 1,
      items: [],
      createdAt: '2024-04-30T12:00:00Z',
    };

    service.clearCart().subscribe((res) => {
      expect(res).toEqual(mockCart);
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/cart/clear');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockCart);
  });

  it('should checkout cart', () => {
    const mockInvoice: InvoiceModel = {
      id: 1,
      userId: 1,
      checkoutRequest: {
        paymentMethod: 'Visa',
        shippingData: {
          cardNumber: '1234567890123456',
          securityCode: '123',
          expirationDate: new Date(),
          fullName: 'Homero Simpson',
          city: 'Springfield',
          address: 'Av. Siempre Viva 742',
          zipCode: '1234',
          phone: '1234567890',
        },
      },
      transactionId: 'trx123',
      total: 200,
      date: '2024-04-30T12:00:00Z',
      details: [],
    };

    const checkoutRequest: CheckoutRequestModel = mockInvoice.checkoutRequest;

    service.checkout(checkoutRequest).subscribe((res) => {
      expect(res).toEqual(mockInvoice);
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/cart/checkout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(checkoutRequest);
    req.flush(mockInvoice);
  });

  it('should get purchases', () => {
    const mockPurchases: PurchaseModel[] = [
      {
        id: 1,
        userId: 1,
        user: {
          id: 1,
          firstName: 'test',
          lastName: 'example',
          email: 'test@example.com',
          password: 'password123456',
          role: AuthRole.Premium,
          purchases: null,
          imageAvatar: 'avatar.png'
        },
        productId: 1,
        product: {
          id: 1,
          name: 'Product',
          brand: 'Test',
          price: 100,
          status: ProductStatus.Enable,
          category: ProductCategory.Technology,
          subCategory: ProductSubCategory.PC,
          stock: 10,
          imageUrl: 'product.png',
          ownerId: 1,
          owner: {
            id: 1,
            firstName: 'test',
            lastName: 'example',
            email: 'test@example.com',
            password: 'password123456',
            role: AuthRole.Premium,
            purchases: null,
            imageAvatar: 'avatar.png'
          }
        },
        quantity: 1,
        purchaseDate: '2024-04-30T12:00:00Z',
      },
    ];

    service.getPurchases().subscribe((res) => {
      expect(res).toEqual(mockPurchases);
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/cart/purchases');
    expect(req.request.method).toBe('GET');
    req.flush(mockPurchases);
  });

  it('should handle error on getCart', () => {
    const errorMessage = 'Test error';

    service.getCart().subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error.message).toBe(errorMessage);
      },
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/cart');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });
});
