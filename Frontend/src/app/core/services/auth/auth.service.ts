import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthModel } from '../../models/auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5169/api/auth';
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  // Método para registrar usuario
  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<AuthModel> {
    const body = { firstName, lastName, email, password };
    return this.http.post<AuthModel>(`${this.apiUrl}/register`, body);
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<AuthModel> {
    return this.http
      .post<AuthModel>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res: any) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.authStatus.next(true);
          }
        })
      );
  }

  // Método para cerrar sesión
  logout(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http
      .post<AuthModel>(`${this.apiUrl}/logout`, {}, { headers })
      .subscribe({
        next: () => {
          this.removeToken();
          this.authStatus.next(false);
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
        },
      });
  }

  // Método para obtener un usuario por su ID
  getUserById(userId: number): Observable<AuthModel> {
    return this.http.get<AuthModel>(`${this.apiUrl}/${userId}`);
  }

  // Método para eliminar usuario (solo admin)
  deleteUser(userId: number): Observable<AuthModel> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.delete<AuthModel>(`${this.apiUrl}/delete/${userId}`, {
      headers,
    });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Método para eliminar el token de localStorage
  private removeToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Método privado para verificar si hay un token en localStorage
  private hasToken(): boolean {
    return (
      typeof localStorage !== 'undefined' && !!localStorage.getItem('token')
    );
  }
}
