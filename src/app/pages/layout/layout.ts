import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  sidebarOpen = true;
  dropdownOpen = false;
  searchTerm = '';
  notificationCount = 3;
  fullName: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.fullName = this.authService.getUserFullName();
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
