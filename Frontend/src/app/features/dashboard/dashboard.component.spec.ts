import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { DashboardModel } from '../../core/models/dashboard/dashboard.model';
import { ProductCategory } from '../../core/models/product/product-category';
import { ProductSubCategory } from '../../core/models/product/product-sub-category';

describe('DashboardComponent with Jest', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: jest.Mocked<DashboardService>;
  let mockAuthService: jest.Mocked<AuthService>;

  const mockDashboardData: DashboardModel = {
    totalUsers: 5,
    users: [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' },
    ],
    totalPurchases: 20,
    products: [
      { id: 1, name: 'Product 1', category: ProductCategory.Technology, price: 100 },
      { id: 2, name: 'Product 2', category: ProductCategory.Technology, price: 50 },
    ],
    totalProducts: 10,
    totalRevenue: 3000,
    productsByCategory: [
      { category: ProductCategory.Technology, totalProducts: 5 },
      { category: ProductCategory.Technology, totalProducts: 5 },
    ],
    categorySales: [
      { category: ProductCategory.Technology, totalSold: 8, percentageSold: 40 },
      { category: ProductCategory.Technology, totalSold: 12, percentageSold: 60 },
    ],
    subcategorySales: [
      {
        category: ProductCategory.Home,
        subCategory: ProductSubCategory.Decor,
        totalSold: 5,
        percentageSold: 25,
      },
      {
        category: ProductCategory.Technology,
        subCategory: ProductSubCategory.Smartphone,
        totalSold: 7,
        percentageSold: 35,
      },
    ],
  };

  beforeEach(async () => {
    mockDashboardService = {
      getDashboardData: jest.fn(),
    } as unknown as jest.Mocked<DashboardService>;

    mockAuthService = {
      isAuthenticated: jest.fn(),
      getToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadDashboard() if authenticated and token exists', () => {
    const loadDashboardSpy = jest.spyOn(component, 'loadDashboard');
    mockAuthService.isAuthenticated.mockReturnValue(true);
    mockAuthService.getToken.mockReturnValue('fake-token');
  
    // mockear acá el observable para que no rompa
    mockDashboardService.getDashboardData.mockReturnValue(of(mockDashboardData));
  
    component.ngOnInit();
  
    expect(loadDashboardSpy).toHaveBeenCalled();
  });
  
  it('should not call loadDashboard() if not authenticated', () => {
    const loadDashboardSpy = jest.spyOn(component, 'loadDashboard');
    mockAuthService.isAuthenticated.mockReturnValue(false);

    component.ngOnInit();

    expect(loadDashboardSpy).not.toHaveBeenCalled();
  });

  it('should set dashboardData on successful data fetch', () => {
    mockDashboardService.getDashboardData.mockReturnValue(of(mockDashboardData));

    component.loadDashboard();

    expect(component.dashboardData).toEqual(mockDashboardData);
  });

  it('should log error on data fetch failure', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const errorResponse = new Error('Failed to fetch');

    mockDashboardService.getDashboardData.mockReturnValue(throwError(() => errorResponse));

    component.loadDashboard();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error to obtain dashboard data:',
      errorResponse
    );
  });
});
