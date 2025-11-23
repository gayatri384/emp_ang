import { Component, OnInit } from '@angular/core';
import { DashboardModal } from './dashboard.modal';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  dashboardData: DashboardModal = {
    totalEmployee: 0,
    activeDepartment: 0,
    totalAssets: 0,
    pendingLeaves: 0
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardOverview().subscribe({
      next: (data: DashboardModal) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    });
  }
}
