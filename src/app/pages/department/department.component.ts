import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Department } from './department.model';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [TitleCasePipe, CommonModule, FormsModule],
  templateUrl: './department.html',
  styleUrls: ['./department.css']
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  selectedDepartment: Department | null = null;

  // Pagination + Search
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalRecords: number = 0;
  searchTerm: string = '';

  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  isLoading: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDepartments();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/department')) {
          this.loadDepartments();
        }
      });
  }

  //  Load departments (with pagination + search)
  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartmentsPaged(this.page, this.pageSize, this.searchTerm).subscribe({
      next: (response: any) => {
        this.departments = response.data;
        this.totalRecords = response.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.isLoading = false;
      }
    });
  }

  //  Search handler
  onSearch(): void {
    this.page = 1;
    this.loadDepartments();
  }

  //  Pagination controls
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadDepartments();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadDepartments();
    }
  }

  //  Modal control
  openModal(mode: 'add' | 'edit', dept?: Department): void {
    this.modalMode = mode;
    this.showModal = true;
    this.selectedDepartment = dept ? { ...dept } : { departmentName: '', description: '' };
  }

  closeModal(): void {
    this.showModal = false;
  }

  //  Add / Update logic
  saveDepartment(): void {
    if (!this.selectedDepartment) return;

    if (this.modalMode === 'add') {
      this.departmentService.addDepartment(this.selectedDepartment).subscribe(() => {
        alert(' Department added successfully');
        this.loadDepartments();
        this.closeModal();
      });
    } else if (this.modalMode === 'edit' && this.selectedDepartment.id) {
      this.departmentService.updateDepartment(this.selectedDepartment.id, this.selectedDepartment).subscribe(() => {
        alert(' Department updated successfully');
        this.loadDepartments();
        this.closeModal();
      });
    }
  }

  //  Delete
  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(() => {
        alert('🗑️ Department deleted successfully');
        this.loadDepartments();
      });
    }
  }

  //  Print Departments
  printAllDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        const printableContent = this.generatePrintableDeptHTML(departments);
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Department List</title></head><body>');
          printWindow.document.write(printableContent);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
        }
      },
      error: (err) => {
        console.error('Print error:', err);
        alert('❌ Failed to fetch department data for printing.');
      }
    });
  }

  generatePrintableDeptHTML(departments: any[]): string {
    const now = new Date().toLocaleString();
    let html = `
      <div style="text-align:center;">
        <img src="assets/images/emp_login.jpg" alt="Company Logo" height="60">
        <h2>Department List</h2>
      </div>
      <p style="text-align:right;">Printed on: ${now}</p>
      <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
        <thead style="background-color:#f2f2f2;">
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
    `;
    departments.forEach(dept => {
      html += `
        <tr>
          <td>${dept.id}</td>
          <td>${dept.name}</td>
          <td>${dept.status}</td>
          <td>${new Date(dept.created_at).toLocaleDateString()}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
    return html;
  }
}
