import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../core/services/product/product.service';
import { of, throwError } from 'rxjs';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductStatus } from '../../../core/models/product/product-status';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: ProductModel[] = [
    {
      id: 1,
      name: 'Laptop',
      brand: 'Asus',
      price: 1000,
      stock: 10,
      category: ProductCategory.Technology,
      subCategory: ProductSubCategory.PC,
      imageUrl: 'laptop.jpg',
      status: ProductStatus.Enable
    }
  ];

  beforeEach(waitForAsync(() => {
    mockProductService = jasmine.createSpyObj('ProductService', ['getAllProducts']);

    TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProducts on ngOnInit', () => {
    mockProductService.getAllProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    expect(component.products.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should map category and subCategory correctly from numeric values', () => {
    const productsWithEnums = [
      {
        ...mockProducts[0],
        category: 0,
        subCategory: 2
      }
    ];
    mockProductService.getAllProducts.and.returnValue(of(productsWithEnums as any));
    component.loadProducts();
    expect(component.products[0].category).toBe(ProductCategory.Technology);
    expect(component.products[0].subCategory).toBe(ProductSubCategory.PC);
  });

  it('should filter products by minPrice', () => {
    mockProductService.getAllProducts.and.returnValue(of(mockProducts));
    component.ngOnInit();
    component.minPrice = 1500;
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(0);
  });

  it('should update subcategories when category is selected', () => {
    component.products = mockProducts;
    component.productCategory = ProductCategory.Technology;
    component.updateSubcategories();
    expect(component.productSubCategories).toContain(ProductSubCategory.PC);
  });

  it('should calculate total pages correctly', () => {
    component.filteredProducts = Array(25).fill(mockProducts[0]);
    component.itemsPerPage = 10;
    expect(component.totalPages).toBe(3);
  });

  it('should return correct paginated products', () => {
    component.filteredProducts = Array.from({ length: 20 }, (_, i) => ({
      ...mockProducts[0],
      _id: `${i + 1}`,
    }));
    component.itemsPerPage = 5;
    component.currentPage = 2;

    const result = component.paginatedProducts;
    expect(result.length).toBe(5);
    expect(result[0].id).toBe(6);
  });

  it('should toggle filters visibility', () => {
    expect(component.showFilters).toBeFalse();
    component.toggleFilters();
    expect(component.showFilters).toBeTrue();
  });

  it('should log error when loadProducts fails', () => {
    spyOn(console, 'error');
    mockProductService.getAllProducts.and.returnValue(throwError(() => new Error('error')));
    component.loadProducts();
    expect(console.error).toHaveBeenCalledWith('Error to obtain products list:', jasmine.any(Error));
  });
});
