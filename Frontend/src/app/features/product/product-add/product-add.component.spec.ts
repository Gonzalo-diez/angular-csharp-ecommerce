import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductAddComponent } from './product-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductStatus } from '../../../core/models/product/product-status';
import { ProductService } from '../../../core/services/product/product.service';
import { AuthService } from '../../../core/services/auth/auth.service';

describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockProductService = {
      addProduct: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;
    
    mockAuthService = {
      isAuthenticated: jest.fn(),
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [ProductAddComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should authenticate user to add product', () => {
      const mockToken = 'header.' + btoa(JSON.stringify({ user: JSON.stringify({ Id: 5 }) })) + '.signature';
      mockAuthService.isAuthenticated.mockReturnValue(true);
      mockAuthService.getToken.mockReturnValue(mockToken);
      
      component.ngOnInit();
  
      expect(component.userId).toBe(5);
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  
    it('should have an invalid form when empty', () => {
      expect(component.productForm.valid).toBe(false);
    });
  
    it('should validate form fields correctly', () => {
      component.userId = 5;
      const form = component.productForm;
  
      form.controls['name'].setValue('test');
      form.controls['brand'].setValue('test');
      form.controls['price'].setValue(100);
      form.controls['stock'].setValue(10);
      form.controls['category'].setValue(ProductCategory.Technology);
      form.controls['subCategory'].setValue(ProductSubCategory.PC);
      form.controls['status'].setValue(ProductStatus.Enable);
      form.controls['image'].setValue('product.png');
  
      expect(form.valid).toBe(true);
    });
  })
});
