import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCategoryComponent } from './product-category.component';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductCategory } from '../../../core/models/product/product-category';
import { ProductSubCategory } from '../../../core/models/product/product-sub-category';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductStatus } from '../../../core/models/product/product-status';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductCategoryComponent', () => {
  let component: ProductCategoryComponent;
  let fixture: ComponentFixture<ProductCategoryComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockProductService = {
      getAllProductsByCategory: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;
  
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ category: 'Technology' })),
    };
  
    await TestBed.configureTestingModule({
      imports: [ProductCategoryComponent, HttpClientTestingModule],
      declarations: [],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(ProductCategoryComponent);
    component = fixture.componentInstance;
  });

  it('debería obtener productos por categoría al inicializar', () => {
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
  
    mockProductService.getAllProductsByCategory.mockReturnValue(of(mockProducts));
  
    fixture.detectChanges(); // Esto ejecuta ngOnInit y la subscripción al paramMap
  
    // Expect: la categoría debería haberse obtenido correctamente desde el ActivatedRoute
    expect(component.category).toBe('Technology');
  
    // Expect: el método del servicio fue llamado con esa categoría
    expect(mockProductService.getAllProductsByCategory).toHaveBeenCalledWith('Technology');
  
    // Expect: los productos fueron asignados correctamente
    expect(component.categoryProducts.length).toBe(1);
    expect(component.filteredProducts.length).toBe(1);
  
    // Expect: propiedades del primer producto coinciden con lo mockeado
    expect(component.categoryProducts[0].name).toBe('PC Gamer');
    expect(component.categoryProducts[0].category).toBe(ProductCategory.Technology);
    expect(component.categoryProducts[0].subCategory).toBe(ProductSubCategory.PC);
  });
  

  it('debería manejar error al obtener productos por categoría', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockProductService.getAllProductsByCategory.mockReturnValue(
      throwError(() => new Error('Error en API'))
    );

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error to obtain products by category:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
