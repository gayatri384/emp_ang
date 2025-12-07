import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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

  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    // ✔ Reload Dashboard ONLY when route becomes active again
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/dashboard') {
        this.loadDashboard();
      }
    });

  }

  ngOnInit(): void {
    console.log('Dashboard initialized');
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;

    this.dashboardService.getDashboardOverview().subscribe({
      next: (data) => {

        if (data) {
          this.dashboardData = data;   // ✔ Set actual data
        }

        this.loading = false;
        console.log('Dashboard data loaded:', data);

        this.cdr.detectChanges();  // ✔ Forces Angular to update template
      },

      error: (err) => {
        console.error('Error fetching dashboard data:', err);
        this.loading = false;

        this.cdr.detectChanges();  // ✔ Update UI even if error
      }
    });
  }
}
