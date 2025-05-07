import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { SignalService } from '../../core/services/signal/signal.service';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { CartModel } from '../../core/models/cart/cart.model';
import { ProductCategory } from '../../core/models/product/product-category';
import { ProductSubCategory } from '../../core/models/product/product-sub-category';
import { ProductStatus } from '../../core/models/product/product-status';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jest.Mocked<CartService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSignalService: jest.Mocked<SignalService>;
  let mockRouter: jest.Mocked<Router>;

  const fakeCart: CartModel = {
    id: 1,
    userId: 5,
    items: [],
    createdAt: '2025-05-02',
  };

  beforeEach(async () => {
    mockCartService = {
      getCart: jest.fn(),
      removeFromCart: jest.fn(),
      checkout: jest.fn(),
    } as unknown as jest.Mocked<CartService>;

    mockAuthService = {
      isAuthenticated: jest.fn(),
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockSignalService = {
      startConnections: jest.fn(),
      sendUpdate: jest.fn(),
      cartUpdates$: new Subject(),
    } as unknown as jest.Mocked<SignalService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SignalService, useValue: mockSignalService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should start connections and load cart if authenticated', () => {
      const mockToken = 'header.' + btoa(JSON.stringify({ user: JSON.stringify({ Id: 5 }) })) + '.signature';
      mockAuthService.isAuthenticated.mockReturnValue(true);
      mockAuthService.getToken.mockReturnValue(mockToken);
      mockCartService.getCart.mockReturnValue(of(fakeCart));

      component.ngOnInit();

      expect(mockSignalService.startConnections).toHaveBeenCalled();
      expect(component.userId).toBe(5);
      expect(mockCartService.getCart).toHaveBeenCalled();
    });

    it('should not load cart if not authenticated', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      component.ngOnInit();

      expect(component.userId).toBeNull();
      expect(mockCartService.getCart).not.toHaveBeenCalled();
    });
  });

  describe('loadCart()', () => {
    it('should load cart data', () => {
      component.userId = 5;
      mockCartService.getCart.mockReturnValue(of(fakeCart));

      component.loadCart();

      expect(component.cart).toEqual(fakeCart);
    });

    it('should set error message on failure', () => {
      component.userId = 5;
      mockCartService.getCart.mockReturnValue(throwError(() => new Error('Error')));

      component.loadCart();

      expect(component.errorMessage).toBe('Error al cargar el carrito.');
    });
  });

  describe('removeItem()', () => {
    it('should remove item and update cart', () => {
      const cartItem = {
        id: 1,
        cartId: 1,
        productId: 1,
        product: {
          id: 1,
          name: 'Product 1',
          brand: 'Test',
          stock: 10,
          category: ProductCategory.Technology,
          subCategory: ProductSubCategory.PC,
          status: ProductStatus.Enable,
          imageUrl: 'test.png',
          price: 50,
        },
        quantity: 1,
      };
      const updatedCart = { ...fakeCart, items: [] };
      component.userId = 5;
      mockCartService.removeFromCart.mockReturnValue(of(updatedCart));

      component.removeItem(cartItem);

      expect(component.cart).toEqual(updatedCart);
      expect(mockSignalService.sendUpdate).toHaveBeenCalledWith(5, updatedCart);
    });

    it('should set error message if remove fails', () => {
      const cartItem = {
        id: 1,
        cartId: 1,
        productId: 1,
        product: {
          id: 1,
          name: 'Product 1',
          brand: 'Test',
          stock: 10,
          category: ProductCategory.Technology,
          subCategory: ProductSubCategory.PC,
          status: ProductStatus.Enable,
          imageUrl: 'test.png',
          price: 50,
        },
        quantity: 1,
      };
      component.userId = 5;
      mockCartService.removeFromCart.mockReturnValue(throwError(() => new Error('Error')));

      component.removeItem(cartItem);

      expect(component.errorMessage).toBe('Error al eliminar el producto.');
    });
  });

  describe('getTotal()', () => {
    it('should calculate total price', () => {
      component.cart.items = [
        {
          id: 1,
          cartId: 1,
          productId: 1,
          product: {
            id: 1,
            name: 'Product 1',
            brand: 'Test',
            stock: 10,
            category: ProductCategory.Technology,
            subCategory: ProductSubCategory.PC,
            status: ProductStatus.Enable,
            imageUrl: 'test.png',
            price: 50,
          },
          quantity: 2,
        },
        {
          id: 2,
          cartId: 1,
          productId: 2,
          product: {
            id: 2,
            name: 'Product 2',
            brand: 'Test',
            stock: 10,
            category: ProductCategory.Technology,
            subCategory: ProductSubCategory.PC,
            status: ProductStatus.Enable,
            imageUrl: 'test.png',
            price: 100,
          },
          quantity: 1,
        },
      ];

      expect(component.getTotal()).toBe(200);
    });
  });

  describe('completeCheckout()', () => {
    it('should perform checkout and navigate on success', () => {
      component.userId = 5;
      component.cart = fakeCart;
      component.paymentMethod = 'MercadoPago';
      const invoiceMock = {
        id: 1,
        userId: 5,
        checkoutRequest: { paymentMethod: 'MercadoPago', shippingData: {} as any },
        transactionId: '123',
        total: 100,
        date: '',
        details: [],
      };
      mockCartService.checkout.mockReturnValue(of(invoiceMock));

      component.completeCheckout();

      expect(mockCartService.checkout).toHaveBeenCalled();
      expect(mockSignalService.sendUpdate).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set error message if checkout fails', () => {
      component.userId = 5;
      component.cart = fakeCart;
      component.paymentMethod = 'credit';
      mockCartService.checkout.mockReturnValue(throwError(() => new Error('Error')));

      component.completeCheckout();

      expect(component.errorMessage).toBe('❌ Error en el proceso de compra.');
    });
  });
});
