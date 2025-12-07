import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Leave } from './leave.model';
import { LeaveService } from '../services/leave.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [FormsModule, CommonModule, MatPaginatorModule],
  templateUrl: './leave.html',
  styleUrl: './leave.css'
})
export class LeaveComponent implements OnInit {

  leaves: Leave[] = [];        // Full data
  pagedLeaves: Leave[] = [];   // Only current page data
  filteredLeaves: Leave[] = [];  // filteredLeaves: Leave[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // paginator values
  length = 0;
  pageSize = 5;
  pageIndex = 0;

  searchText: string = "";
  statusFilter: string = ""; // Approved / Pending / Rejected

  constructor(
    private leaveService: LeaveService,
    private routes: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchLeaves();

    // Reload when navigating back to /leave
    this.routes.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/leave')) {
          this.fetchLeaves();
        }
      });
  }

  // Load data from API
  fetchLeaves() {
    this.leaveService.getLeaves().subscribe({
      next: (data) => {
        this.leaves = data;
        //Set filteredLeaves initially
        this.filteredLeaves = data;
        // Set paginator length
        this.length = this.filteredLeaves.length;
        // Display page 1
        this.pageIndex = 0;
        this.setPageData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading leaves:", err);
      }
    });
  }
  // Slice data manually for pagination
  setPageData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedLeaves = this.filteredLeaves.slice(start, end);
  }


  // Trigger on paginator click
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.setPageData();
  }

  // approve leave
  approveLeave(leaveId: number) {
    this.leaveService.updateLeaveStatus(leaveId, 'Approved').subscribe({
      next: () => {
        alert('Leave approved successfully');
        this.fetchLeaves();
      },
      error: (err) => console.error('Error approving leave:', err)
    });
  }

  // reject leave
  rejectLeave(leaveId: number) {
    this.leaveService.updateLeaveStatus(leaveId, 'Rejected').subscribe({
      next: () => {
        alert('Leave rejected successfully');
        this.fetchLeaves();
      },
      error: (err) => console.error('Error rejecting leave:', err)
    });
  }

  // delete leave
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
      });
    }
  }

  // SEARCH + STATUS FILTER
  applyFilters() {
    const text = this.searchText.toLowerCase().trim();

    this.filteredLeaves = this.leaves.filter(l => {
      const matchSearch =
        (l.employee?.fullName.toLowerCase().includes(text)) ||
        (l.reason?.toLowerCase().includes(text)) ||
        (l.status?.toLowerCase().includes(text));

      const matchStatus =
        this.statusFilter === "" || l.status === this.statusFilter;

      return matchSearch && matchStatus;
    });

    // Update paginator total length
    this.length = this.filteredLeaves.length;

    // Reset to first page
    this.pageIndex = 0;

    // Apply slice to page
    this.setPageData();
  }
}
