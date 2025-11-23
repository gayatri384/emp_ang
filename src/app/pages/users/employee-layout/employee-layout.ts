import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-layout.html',
  styleUrls: ['./employee-layout.css']
})
export class EmployeeLayoutComponent {
  sidebarOpen = true;
  dropdownOpen = false;
  fullname: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.fullname = this.authService.getUserFullName();
  }
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.clear();
    alert("Logout Successfully");
    this.router.navigate(['/login']);
  }
}
