import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Leave } from './leave.model';
import { OnInit } from '@angular/core';
import { LeaveService } from '../services/leave.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-leave',
  imports: [FormsModule, CommonModule],
  templateUrl: './leave.html',
  styleUrl: './leave.css'
})
export class LeaveComponent implements OnInit {
  leaves: Leave[] = [];

  // Pagination + Search
  page = 1;
  pageSize = 5;
  totalRecords = 0;
  searchText = "";

  constructor(private leaveService: LeaveService, private routes: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchLeaves();

    this.routes.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/leave')) {
          console.log("Navigated to /leave, reloading data");
          this.fetchLeaves();
        }
      });
  }
  fetchLeaves() {
    console.log("Loading employee data...");
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        console.log("Employee data received:", data);
        this.leaves = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading employees:", err);
      }
    });
  }

  // Approve leave
  approveLeave(leaveId: number) {
    this.leaveService.updateLeaveStatus(leaveId, 'Approved').subscribe({
      next: (res) => {
        alert('Leave approved successfully');
        this.fetchLeaves(); // refresh list
      },
      error: (err) => console.error('Error approving leave:', err)
    });
  }

  // Reject leave
  rejectLeave(leaveId: number) {
    this.leaveService.updateLeaveStatus(leaveId, 'Rejected').subscribe({
      next: (res) => {
        alert('Leave rejected successfully');
        this.fetchLeaves(); // refresh list
      },
      error: (err) => console.error('Error rejecting leave:', err)
    });
  }

  deleteLeave(Id: number) {
    if (confirm('Are you sure to delete this record?')) {
      this.leaveService.deleteLeave(Id).subscribe({
        next: () => {
          alert('Leave Deleted');
          this.fetchLeaves();
        },
        error: (err) => {
          console.error('Error deleting leave:', err);
          alert('Failed to delete leave. Please try again.');
        }
      })
    }
  }
  // Search event
  onSearch() {
    this.page = 1;
    this.fetchLeaves();
  }

  // Next page
  nextPage() {
    if (this.page < Math.ceil(this.totalRecords / this.pageSize)) {
      this.page++;
      this.fetchLeaves();
    }
  }

  // Previous page
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchLeaves();
    }
  }
}