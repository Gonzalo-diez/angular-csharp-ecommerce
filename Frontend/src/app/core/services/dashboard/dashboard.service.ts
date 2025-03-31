import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardModel } from '../../models/dashboard/dashboard.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:5169/api/dashboard';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getDashboardData(): Observable<DashboardModel> {
    const token = this.authService.getToken();

    if (!token) {
      console.error("No token found. User is not authenticated.");
      throw new Error("Unauthorized: No token provided.");
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<DashboardModel>(this.apiUrl, { headers });
  }
}
