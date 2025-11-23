import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AssetService } from '../services/asset.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-assets',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assign-assets.html',
  styleUrls: ['./assign-assets.css']
})
export class AssignAssetsComponent implements OnInit {
  assignments: any[] = [];
  employees: any[] = [];
  assets: any[] = [];

  showModal = false;
  isEditMode = false;

  selectedAssignment: any = {
    assignmentId: 0,
    employeeId: 0,
    assetId: 0,
    remarks: '',
    isDamagedOnReturn: false
  };

  constructor(
    private assignService: AssetService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAssets();
    this.loadAssignments();
  }

  // Load Employees
  loadEmployees() {
    this.http.get<any[]>('https://localhost:44362/api/Employee/list').subscribe({
      next: res => (this.employees = res),
      error: err => console.error('Error loading employees:', err)
    });
  }

  // Load Assets
  loadAssets() {
    this.http.get<any[]>('https://localhost:44362/api/Asset').subscribe({
      next: res => (this.assets = res),
      error: err => console.error('Error loading assets:', err)
    });
  }

  // Load Assigned Assets
  loadAssignments() {
    this.assignService.getAllAssignments().subscribe({
      next: data => {
        this.assignments = data;
        this.cdr.detectChanges();
      },
      error: err => console.error('Error loading assignments:', err)
    });
  }

  // Open Modal
  openModal(mode: 'add' | 'edit', assignment?: any) {
    this.isEditMode = mode === 'edit';
    this.showModal = true;
    this.selectedAssignment = assignment
      ? { ...assignment }
      : { assignmentId: 0, employeeId: 0, assetId: 0, remarks: '', isDamagedOnReturn: false };
  }

  // Close Modal
  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
  }

  // Submit (Add or Update)
  submitAssignment() {
    if (!this.selectedAssignment.employeeId || !this.selectedAssignment.assetId) {
      alert('Please select both employee and asset.');
      return;
    }

    // ✅ Convert to backend model casing
    const payload = {
      EmployeeId: this.selectedAssignment.employeeId,
      AssetId: this.selectedAssignment.assetId,
      Remarks: this.selectedAssignment.remarks,
      IsDamagedOnReturn: this.selectedAssignment.isDamagedOnReturn
    };

    console.log('Sending payload:', payload);

    if (this.isEditMode) {
      // ✅ Update assignment
      this.assignService
        .updateAssignment(this.selectedAssignment.assignmentId, payload)
        .subscribe({
          next: res => {
            alert(res.message || 'Assignment updated successfully!');
            this.closeModal();
            this.loadAssignments();
          },
          error: err => {
            console.error('Error updating assignment:', err);
            alert(err.error?.message || 'Error updating assignment.');
          }
        });
    } else {
      // ✅ Assign new asset
      this.assignService.assignAsset(payload).subscribe({
        next: res => {
          alert(res.message || 'Asset assigned successfully!');
          this.closeModal();
          this.loadAssignments();
        },
        error: err => {
          console.error('Error assigning asset:', err);
          alert(err.error?.message || 'Error assigning asset.');
        }
      });
    }
  }

  // Delete
  deleteAssignment(id: number) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignService.deleteAssignment(id).subscribe({
        next: () => {
          alert('Assignment deleted successfully!');
          this.loadAssignments();
        },
        error: err => {
          console.error('Error deleting assignment:', err);
          alert('Error deleting assignment.');
        }
      });
    }
  }
}
