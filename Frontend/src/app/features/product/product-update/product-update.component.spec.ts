import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductUpdateComponent } from './product-update.component';
import { ProductService } from '../../../core/services/product/product.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductStatus } from '../../../core/models/product/product-status';
import { of } from 'rxjs';
import { ProductModel } from '../../../core/models/product/product.model';

describe('ProductUpdateComponent', () => {
  let component: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let mockProductService: ProductService;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockProduct: ProductModel = {
    id: 1,
    name: 'test',
    brand: 'test',
    price: 100,
    stock: 10,
    category: ProductCategory.Technology,
    subCategory: ProductSubCategory.PC,
    status: ProductStatus.Enable,
    imageUrl: 'product.png',
    ownerId: 5,
  };

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: jest.fn(),
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockProductService = {
      updateProduct: jest.fn(),
      getProductById: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    await TestBed.configureTestingModule({
      imports: [ProductUpdateComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ProductService, useValue: mockProductService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
      ],
    }).compileComponents();

    mockProductService = TestBed.inject(ProductService);

    jest.spyOn(mockProductService, 'getProductById').mockReturnValue(of(mockProduct));
    jest.spyOn(mockProductService, 'updateProduct').mockReturnValue(of(mockProduct));

    fixture = TestBed.createComponent(ProductUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should authenticate user and load product by id', () => {
      const mockProduct: ProductModel = {
        id: 1,
        name: 'test',
        brand: 'test',
        price: 100,
        stock: 10,
        category: ProductCategory.Technology,
        subCategory: ProductSubCategory.PC,
        status: ProductStatus.Enable,
        imageUrl: 'product.png',
        ownerId: 5,
      };

      const mockToken =
        'header.' +
        btoa(JSON.stringify({ user: JSON.stringify({ Id: 5 }) })) +
        '.signature';
      mockAuthService.isAuthenticated.mockReturnValue(true);
      mockAuthService.getToken.mockReturnValue(mockToken);

      component.ngOnInit();

      expect(mockProductService.getProductById).toHaveBeenCalledWith(1);
      expect(component.userId).toBe(5);
    });

    it('should update product', () => {
      component.productId = 1;
      const form = component.productForm;
  
      form.controls['name'].setValue('test');
      form.controls['brand'].setValue('test');
      form.controls['price'].setValue(100);
      form.controls['stock'].setValue(0);
      form.controls['category'].setValue(ProductCategory.Technology);
      form.controls['subCategory'].setValue(ProductSubCategory.PC);
      form.controls['status'].setValue(ProductStatus.Enable);
  
      expect(form.valid).toBe(true);
    });
  });
});
