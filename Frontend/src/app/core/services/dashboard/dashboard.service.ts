import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DashboardModel } from '../../models/dashboard/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:5169/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching dashboard data:', error);
        return throwError(() => new Error('Failed to fetch dashboard data.'));
      })
    );
  }
}
