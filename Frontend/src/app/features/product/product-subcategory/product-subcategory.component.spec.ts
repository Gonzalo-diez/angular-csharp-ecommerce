import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSubcategoryComponent } from './product-subcategory.component';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductStatus } from '../../../core/models/product/product-status';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductSubcategoryComponent', () => {
  let component: ProductSubcategoryComponent;
  let fixture: ComponentFixture<ProductSubcategoryComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockProductService = {
      getAllProductsBySubCategory: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ category: 'Technology', subcategory: 'PC' })),
    };

    await TestBed.configureTestingModule({
      imports: [ProductSubcategoryComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSubcategoryComponent);
    component = fixture.componentInstance;
  });

  it('deberia obtener productos por subcategoria la inicializar', () => {
    const mockProducts: ProductModel[] = [
      {
        id: 1,
        name: 'PC Gamer',
        brand: 'Asus',
        price: 2500,
        stock: 5,
        category: ProductCategory.Technology,
        subCategory: ProductSubCategory.PC,
        status: ProductStatus.Enable,
        imageUrl: 'pc.png',
      },
    ];

    mockProductService.getAllProductsBySubCategory.mockReturnValue(of(mockProducts));

    fixture.detectChanges();

    expect(component.category).toBe('Technology');
    expect(component.subcategory).toBe('PC');
    expect(mockProductService.getAllProductsBySubCategory).toHaveBeenCalledWith('Technology', 'PC');
    expect(component.subcategoryProducts.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
    expect(component.subcategoryProducts[0].name).toBe('PC Gamer');
    expect(component.subcategoryProducts[0].category).toBe(ProductCategory.Technology);
    expect(component.subcategoryProducts[0].subCategory).toBe(ProductSubCategory.PC);
  });

  it('deberia manejar error al obtener productos por subcategoria', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockProductService.getAllProductsBySubCategory.mockReturnValue(
      throwError(() => new Error('Error en API'))
    );

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error to obtain products in subcategory:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  })
});
