import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { DashboardModal } from './dashboard.modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  dashboardData: DashboardModal = {
    totalEmployee: 0,
    activeDepartment: 0,
    totalAssets: 0,
    pendingLeaves: 0
  };

  loading = true; // add a loading flag

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard initialized');
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.dashboardService.getDashboardOverview().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
        console.log('Dashboard data loaded:', data);
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.loading = false;
      }
    });
  }
}
