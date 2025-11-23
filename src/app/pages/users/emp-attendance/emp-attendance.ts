import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-emp-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emp-attendance.html',
  styleUrls: ['./emp-attendance.css']
})
export class EmpAttendance implements OnInit {
  attendanceList: any[] = [];
  message: string = '';
  isMarkedToday: boolean = false;

  constructor(private attendanceService: AttendanceService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadAttendance();
  }

  markAttendance(status: number) {
    const today = new Date();
    const attendanceData = {
      date: today,
      checkIn: new Date().toISOString(),
      checkOut: null,
      isHalfDay: status === 2,
      remarks: status === 3 ? 'Leave' : ''
    };

    this.attendanceService.markAttendance(attendanceData).subscribe({
      next: () => {
        this.message = 'Attendance marked successfully!';
        this.isMarkedToday = true;
        this.loadAttendance();
      },
      error: () => this.message = 'Error marking attendance!'
    });
  }

  loadAttendance() {
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const end = new Date().toISOString().split('T')[0];

    this.attendanceService.getEmployeeAttendance(start, end).subscribe({
      next: (res) => {
        this.attendanceList = res;
        const today = new Date().toDateString();

        this.isMarkedToday = res.some((a: any) =>
          new Date(a.date).toDateString() === today
        );

        this.cdr.detectChanges();
      },

      error: () => {
        this.message = 'Error loading attendance!';
        this.cdr.detectChanges(); 
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Absent';
      case 1: return 'Present';
      case 2: return 'Half Day';
      case 3: return 'Leave';
      default: return '';
    }
  }
}
