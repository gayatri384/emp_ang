import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class Attendance implements OnInit {
  attendanceList: any[] = [];
  filteredList: any[] = [];
  message = '';

  // Filters
  searchName = '';
  selectedDate = '';

  constructor(
    private attendanceService: AttendanceService,
    private cdr: ChangeDetectorRef        // <-- added
  ) { }

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance() {
    this.attendanceService.getAllEmployeeAttendance().subscribe({
      next: (res) => {
        this.attendanceList = res;
        this.filteredList = res;

        console.log("Attendance Loaded:", res);

        this.cdr.detectChanges();   // <-- Force UI refresh
      },
      error: (err) => {
        console.error("Error:", err);
        this.message = "Error loading attendance!";
        this.cdr.detectChanges();   // <-- Refresh error message
      }
    });
  }

  // Filter logic
  applyFilters() {
    this.filteredList = this.attendanceList.filter(a => {
      const matchesName = a.employeeName.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesDate = this.selectedDate ? a.date.includes(this.selectedDate) : true;
      return matchesName && matchesDate;
    });

    this.cdr.detectChanges();   // <-- Update table after filtering
  }

  updateAttendance(employeeId: number, date: string, status: number) {
    const data = { employeeId, date, status };

    this.attendanceService.upsertAttendance(data).subscribe({
      next: () => {
        this.message = '✅ Attendance updated successfully!';
        this.loadAttendance();       // reload list
        this.cdr.detectChanges();    // <-- Force refresh
      },
      error: () => {
        this.message = '❌ Error updating attendance!';
        this.cdr.detectChanges();    // <-- Refresh UI
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'A';
      case 1: return 'P';
      case 2: return 'H';
      case 3: return 'L';
      default: return '';
    }
  }
}
