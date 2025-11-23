import { Component, OnInit } from '@angular/core';
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
export class AttendanceComponent implements OnInit {
  attendanceList: any[] = [];
  filteredList: any[] = [];
  message = '';

  // Filters
  searchName = '';
  selectedDate = '';

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance() {
    this.attendanceService.getAllEmployeeAttendance().subscribe({
      next: (res) => {
        this.attendanceList = res;
        this.filteredList = res;
      },
      error: () => this.message = 'Error loading attendance'
    });
  }

  // Filter logic
  applyFilters() {
    this.filteredList = this.attendanceList.filter(a => {
      const matchesName = a.employeeName.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesDate = this.selectedDate ? a.date.includes(this.selectedDate) : true;
      return matchesName && matchesDate;
    });
  }

  updateAttendance(employeeId: number, date: string, status: number) {
    const data = { employeeId, date, status };

    this.attendanceService.upsertAttendance(data).subscribe({
      next: () => {
        this.message = '✅ Attendance updated successfully!';
        this.loadAttendance();
      },
      error: () => this.message = '❌ Error updating attendance!'
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
