import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { DashboardModel } from '../../models/dashboard/dashboard.model';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        DashboardService,
      ],
    });

    service = TestBed.inject(DashboardService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dashboard data successfully', () => {
    const mockResponse: DashboardModel = {
      totalUsers: 10,
      totalRevenue: 50000,
      totalProducts: 100,
      totalPurchases: 20,
      users: [],
      products: [],
      productsByCategory: [],
      categorySales: [],
      subcategorySales: [],
    };

    service.getDashboardData().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(
      (request) =>
        request.url === 'http://localhost:5169/api/dashboard' &&
        request.method === 'GET'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error when fetching dashboard data fails', () => {
    service.getDashboardData().subscribe({
      next: () => fail('Expected error, but got success'),
      error: (err) => {
        expect(err.message).toBe('Failed to fetch dashboard data.');
      },
    });

    const req = httpTesting.expectOne(
      (request) =>
        request.url === 'http://localhost:5169/api/dashboard' &&
        request.method === 'GET'
    );

    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });
});
