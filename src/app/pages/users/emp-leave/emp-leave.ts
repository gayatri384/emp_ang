import { Component, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp-leave',
  imports: [CommonModule, FormsModule],
  templateUrl: './emp-leave.html',
  styleUrls: ['./emp-leave.css']
})
export class EmpLeave implements OnInit {
  leave = {
    startDate: '',
    endDate: '',
    reason: ''
  };
  message = '';
  loading = false;
  leaves: any[] = [];

  constructor(private leaveService: LeaveService, private router: Router, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadLeaves(); // Load employee-specific leaves after login
  }

  applyLeave() {
    const employeeId = this.leaveService.getEmployeeIdFromToken();
    if (!employeeId) {
      alert('❌ Employee not logged in!');
      return;
    }

    if (!this.leave.startDate || !this.leave.endDate || !this.leave.reason) {
      alert('❌ Please fill in all fields.');
      return;
    }

    const payload = {
      employeeId,
      startDate: this.leave.startDate,
      endDate: this.leave.endDate,
      reason: this.leave.reason
    };

    this.loading = true;

    this.leaveService.applyLeave(payload).subscribe(
      (res) => {
        alert(res.message || ' Leave request submitted successfully!');
        this.leave = { startDate: '', endDate: '', reason: '' };
        this.loading = false;
        this.loadLeaves(); //  Refresh list after applying
      },
      (err) => {
        alert(err.error?.message || '❌ Failed to submit leave request.');
        this.loading = false;
      }
    );
  }

  loadLeaves() {
    this.leaveService.getMyLeaves().subscribe({
      next: (res) => {
        console.log(' Leaves fetched:', res);
        this.leaves = res;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('❌ Failed to load leaves', err);
      }
    });
  }
}
