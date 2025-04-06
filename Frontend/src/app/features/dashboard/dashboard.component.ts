import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import {
  DashboardModel,
  CategorySalesDto,
  SubcategorySalesDto,
} from '../../core/models/dashboard/dashboard.model';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardModel | null = null;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      if (token) {
        this.loadDashboard();
      }
    }
  }

  loadDashboard(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        console.log('Dashboard data:', data);
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error to obtain dashboard data:', error);
      },
    });
  }
}
