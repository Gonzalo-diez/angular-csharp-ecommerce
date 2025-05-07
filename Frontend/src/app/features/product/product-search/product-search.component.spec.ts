import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { ProductSearchComponent } from './product-search.component';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductStatus } from '../../../core/models/product/product-status';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ActivatedRoute } from '@angular/router';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;
  let mockProductService: any;
  let queryParamsSubject: Subject<any>;

  beforeEach(async () => {
    mockProductService = {
      searchProducts: jest.fn(),
    };

    queryParamsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search products on init', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Laptop',
        brand: 'Dell',
        price: 1200,
        stock: 10,
        category: ProductCategory.Technology,
        subCategory: ProductSubCategory.PC,
        status: ProductStatus.Enable,
        imageUrl: 'test.jpg',
      },
    ];

    mockProductService.searchProducts.mockReturnValue(of(mockProducts));

    component.searchQuery = 'Laptop';
    component.fetchProducts();
    component.ngOnInit();

    expect(mockProductService.searchProducts).toHaveBeenCalledWith('Laptop');

    fixture.whenStable?.().then(() => {
      expect(component.products.length).toBe(1);
    })
  });
});
