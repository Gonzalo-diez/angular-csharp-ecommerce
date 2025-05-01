import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AuthModel } from '../../models/auth/auth.model';
import { AuthRole } from '../../models/auth/auth.role';
import * as TokenUtils from '../../utils/token.util';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        AuthService,
      ],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should do register', () => {
    const mockResponse = { token: 'fake-jwt-token' };

    const mockFile = new File([''], 'photo.png', { type: 'image/png' });

    service
      .register(
        'user',
        'example',
        'user@example.com',
        'password123456',
        mockFile
      )
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

    const req = httpTesting.expectOne(
      'http://localhost:5169/api/auth/register'
    );
    expect(req.request.method).toBe('POST');

    const formData = req.request.body as FormData;
    expect(formData.get('firstName')).toBe('user');
    expect(formData.get('lastName')).toBe('example');
    expect(formData.get('email')).toBe('user@example.com');
    expect(formData.get('password')).toBe('password123456');

    const fileReceived = formData.get('image') as File;
    expect(fileReceived.name).toBe('photo.png');
    expect(fileReceived.type).toBe('image/png');

    req.flush(mockResponse);
  });

  it('should do login', () => {
    const mockResponse = { token: 'fake-jwt-token' };

    service.login('user@example.com', 'password123456').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne('http://localhost:5169/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'user@example.com',
      password: 'password123456',
    });

    req.flush(mockResponse);
  });

  it('should do logout and remove token from localStorage', () => {
    const mockUser: AuthModel = {
      id: 1,
      firstName: 'user',
      lastName: 'example',
      email: 'user@example.com',
      password: 'password123456',
      role: AuthRole.User,
      purchases: null,
      imageAvatar: 'avatar.png',
    };
    const token = 'fake-token';
    localStorage.setItem('token', token);
    jest.spyOn(service, 'getToken').mockReturnValue(token);
    jest
      .spyOn(TokenUtils, 'decodeToken')
      .mockReturnValue({ id: 1, role: mockUser.role, exp: 10000 });

    const authStatusSpy = jest.spyOn(service.authStatus, 'set');

    service.logout();

    const req = httpTesting.expectOne(
      (request) =>
        request.url === 'http://localhost:5169/api/auth/logout' &&
        request.method === 'POST'
    );

    expect(req.request.body).toEqual({});
    req.flush({});

    expect(localStorage.getItem('token')).toBeNull();
    expect(authStatusSpy).toHaveBeenCalledWith(false);
  });

  it('should delete user by ID', () => {
    const mockResponse: AuthModel = {
      id: 1,
      firstName: 'user',
      lastName: 'example',
      email: 'user@example.com',
      password: 'password123456',
      role: AuthRole.User,
      purchases: null,
      imageAvatar: 'avatar.png',
    };

    service.deleteUser(1).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne(
      'http://localhost:5169/api/auth/delete/1'
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('should upgrade user role', () => {
    const token = 'fake-token-jwt';
    localStorage.setItem('token', token);

    const paymentMethod = 'MercadoPago';
    const cardNumber = 3216265161465;
    const securityNumber = 123;

    const expectedResponse = { token: 'new-premium-token' };

    jest
      .spyOn(TokenUtils, 'decodeToken')
      .mockReturnValue({ id: 1, role: AuthRole.User, exp: 10000 });

    service
      .upgradeToPremium(paymentMethod, cardNumber, securityNumber)
      .subscribe((res) => {
        expect(res).toEqual(expectedResponse);
      });

    const req = httpTesting.expectOne(
      (request) =>
        request.url === 'http://localhost:5169/api/auth/upgrade' &&
        request.method === 'POST'
    );

    req.flush(expectedResponse);
  });
});
