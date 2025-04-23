import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthModel } from '../../models/auth/auth.model';
import { decodeToken } from '../../utils/token.util';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5169/api/auth';

  // 🔥 Ahora usamos `signal` en lugar de `BehaviorSubject`
  authStatus = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    if (this.hasToken()) {
      this.authStatus.set(true);
    }
  }

  register(firstName: string, lastName: string, email: string, password: string, image: File): Observable<AuthModel> {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    return this.http.post<AuthModel>(`${this.apiUrl}/register`, formData);
  }

  login(email: string, password: string): Observable<AuthModel> {
    return this.http.post<AuthModel>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.authStatus.set(true);
        }
      }),
      catchError((error) => {
        console.error('Error in login:', error);
        return throwError(() => new Error(error.error?.message || 'Error in auth'));
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.removeToken();
        this.authStatus.set(false);
      },
      error: (err) => console.error('Error al cerrar sesión:', err),
    });
  }

  getUserById(userId: number): Observable<AuthModel> {
    return this.http.get<AuthModel>(`${this.apiUrl}/${userId}`);
  }

  deleteUser(userId: number): Observable<AuthModel> {
    return this.http.delete<AuthModel>(`${this.apiUrl}/delete/${userId}`);
  }

  isAuthenticated(): boolean {
    return this.authStatus(); 
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
  }

  getDecodedUser() {
    const token = this.getToken();
    return token ? decodeToken(token) : null;
  }

  private removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  private hasToken(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }
}