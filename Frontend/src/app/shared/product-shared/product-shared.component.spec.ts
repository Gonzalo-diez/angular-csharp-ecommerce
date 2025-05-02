import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSharedComponent } from './product-shared.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { ProductService } from '../../core/services/product/product.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthRole } from '../../core/models/auth/auth.role';

describe('ProductSharedComponent', () => {
  let component: ProductSharedComponent;
  let fixture: ComponentFixture<ProductSharedComponent>;
  let authServiceMock: any;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: jest.fn(),
      getToken: jest.fn(),
      getDecodedUser: jest.fn(),
    };

    productServiceMock = {
      deleteProduct: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ProductSharedComponent],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSharedComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería asignar userId y userRole si está autenticado', () => {
      authServiceMock.isAuthenticated.mockReturnValue(true);
      authServiceMock.getToken.mockReturnValue('mock-token');
      authServiceMock.getDecodedUser.mockReturnValue({
        id: '10',
        role: AuthRole.Premium,
      });

      component.ngOnInit();

      expect(component.userId).toBe(10);
      expect(component.userRole).toBe(AuthRole.Premium);
    });

    it('no debería asignar userId ni userRole si no está autenticado', () => {
      authServiceMock.isAuthenticated.mockReturnValue(false);

      component.ngOnInit();

      expect(component.userId).toBeNull();
      expect(component.userRole).toBeNull();
    });
  });

  describe('canAddProduct', () => {
    it('debería devolver true si userRole es Premium', () => {
      component.userRole = AuthRole.Premium;
      expect(component.canAddProduct()).toBe(true);
    });

    it('debería devolver false si userRole no es Premium', () => {
      component.userRole = 'user';
      expect(component.canAddProduct()).toBe(false);
    });
  });

  describe('goToAddProduct', () => {
    it('debería navegar si userRole es Premium', () => {
      component.userRole = AuthRole.Premium;
      component.goToAddProduct();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/product/add']);
    });

    it('no debería navegar si userRole no es Premium', () => {
      component.userRole = 'user';
      component.goToAddProduct();
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('goToUpdateProduct', () => {
    it('debería navegar si userId coincide con ownerId', () => {
      component.userId = 10;
      component.goToUpdateProduct(1, 10);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/product/update/1']);
    });

    it('no debería navegar si userId no coincide con ownerId', () => {
      component.userId = 10;
      component.goToUpdateProduct(1, 5);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('no debería navegar si productId no está definido', () => {
      component.userId = 10;
      component.goToUpdateProduct(null as any, 10);
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('debería eliminar producto y actualizar lista local en éxito', () => {
      const mockProduct = { id: 1, title: 'Producto', price: 100 } as any;
      component.products = [mockProduct];

      productServiceMock.deleteProduct.mockReturnValue(of({}));

      component.deleteProduct(1);

      expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(1);
      expect(component.products.length).toBe(0);
    });

    it('debería loggear error si falla el delete', () => {
      console.error = jest.fn();
      productServiceMock.deleteProduct.mockReturnValue(
        throwError(() => new Error('Error eliminando'))
      );

      component.deleteProduct(1);

      expect(console.error).toHaveBeenCalledWith(
        '❌ Error eliminando producto:',
        expect.any(Error)
      );
    });
  });
});
