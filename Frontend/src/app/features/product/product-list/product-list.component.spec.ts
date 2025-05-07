import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductListComponent } from './product-list.component';
import { of } from 'rxjs';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductStatus } from '../../../core/models/product/product-status';

describe('ProductListComponent with Jest', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jest.Mocked<ProductService>;

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
    {
      id: 2,
      name: 'T-shirt',
      brand: 'Zara',
      price: 25,
      stock: 50,
      category: ProductCategory.Clothing,
      subCategory: ProductSubCategory.Men,
      status: ProductStatus.Enable,
      imageUrl: 'shirt.jpg',
    },
  ];

  beforeEach(async () => {
    mockProductService = {
      getAllProducts: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, HttpClientTestingModule],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    mockProductService.getAllProducts.mockReturnValue(of(mockProducts));

    component.ngOnInit();

    expect(mockProductService.getAllProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should filter products by price range', () => {
    component.products = mockProducts;
    component.filteredProducts = [...mockProducts];
    component.minPrice = 30;
    component.maxPrice = 1300;

    component.filterProducts();

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Laptop');
  });

  it('should update subcategories based on selected category', () => {
    component.products = mockProducts;
    component.productCategory = ProductCategory.Technology;

    component.updateSubcategories();

    expect(component.productSubCategories).toContain(ProductSubCategory.PC);
    expect(component.productSubCategories).not.toContain(
      ProductSubCategory.Men
    );
  });

  it('should toggle showFilters', () => {
    expect(component.showFilters).toBe(false);

    component.toggleFilters();

    expect(component.showFilters).toBe(true);
  });
});
