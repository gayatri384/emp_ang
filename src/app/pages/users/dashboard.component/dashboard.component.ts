import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../services/asset.service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  employeeName = '';
  employeeRole = '';
  assignedAssetsCount = 0;
  pendingReturnsCount = 0;
  damagedAssetsCount = 0;
  // display full name and role
  fullname: string | null = null;

  constructor(private assetService: AssetService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEmployeeDetails();
    this.loadEmployeeAssets();
    this.fullname = this.authService.getUserFullName();
  }

  loadEmployeeDetails() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.employeeName = decoded?.name || 'Employee';
      this.employeeRole = decoded?.role || 'Employee';
    }
  }

  loadEmployeeAssets() {
    this.assetService.getMyAssets().subscribe({
      next: (assets: any[]) => {
        this.assignedAssetsCount = assets.length;
        this.pendingReturnsCount = assets.filter(a => !a.returnDate).length;
        this.damagedAssetsCount = assets.filter(a => a.isDamagedOnReturn).length;
      },
      error: err => console.error('Error loading assets:', err)
    });
  }
}
