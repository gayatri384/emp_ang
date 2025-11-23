import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Employee } from './employee.model';
import { EmployeeService } from '../services/employee.service';
import { Department } from '../department/department.model';
import { DepartmentService } from '../services/department.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [TitleCasePipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  selectedEmployee: Employee | null = null;

  searchText: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  otpModal: boolean = false;

  otpEmail: string = '';
  otpCode: string = '';

  constructor(
    private employeeService: EmployeeService,
    private routes: Router,
    private deptService: DepartmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.routes.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.includes('/employee')) {
          this.loadEmployees();
        }
      });

    this.deptService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  loadEmployees() {
    this.employeeService.getEmployeesPaged(this.page, this.pageSize, this.searchText)
      .subscribe({
        next: (res: any) => {
          this.employees = res.data;
          this.totalPages = res.totalPages;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error loading employees:", err);
        }
      });
  }

  search() {
    this.page = 1;
    this.loadEmployees();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadEmployees();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadEmployees();
    }
  }

  openModal(mode: 'add' | 'edit', employee?: Employee) {
    this.modalMode = mode;
    this.showModal = true;

    if (employee) {
      this.selectedEmployee = { ...employee, departmentId: employee.department?.id || 0 };
    } else {
      this.selectedEmployee = {
        id: 0,
        fullName: '',
        email: '',
        password: '',
        mobile: '',
        address: '',
        gender: '',
        dateOfBirth: '',
        departmentId: 0,
        designation: '',
        joiningDate: '',
        salary: 0,
        role: 'Employee',
        isActive: true,
        isverify: false
      };
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveEmployee() {
    if (!this.selectedEmployee) return;

    if (this.modalMode === 'add') {
      this.employeeService.addEmployee(this.selectedEmployee).subscribe(() => {
        alert("Employee added successfully");
        this.loadEmployees();
        this.closeModal();
      });
    } else if (this.modalMode === 'edit') {
      this.employeeService.updateEmployee(this.selectedEmployee.id!, this.selectedEmployee)
        .subscribe(() => {
          alert("Employee updated successfully");
          this.loadEmployees();
          this.closeModal();
        });
    }
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      alert("Employee deleted successfully");
      this.loadEmployees();
    });
  }

  // OTP
  openOTPModal() { this.otpModal = true; this.otpEmail = ''; this.otpCode = ''; }
  closeOTPModal() { this.otpModal = false; }
  verifyOTP() {
    if (this.otpEmail && this.otpCode) {
      this.employeeService.verifyOTP(this.otpEmail, this.otpCode).subscribe({
        next: (res: any) => { alert(res); this.closeOTPModal(); },
        error: (err) => { alert(err.error || err.message); }
      });
    } else alert("Enter Email and OTP");
  }

  // Print
  printAllEmployees() {
    this.employeeService.getEmployeesPaged(1, 1000).subscribe({
      next: (res: any) => {
        const html = this.generatePrintableHTML(res.data);
        const win = window.open('', '', 'height=600,width=800');
        if (win) {
          win.document.write('<html><head><title>Employee List</title></head><body>' + html + '</body></html>');
          win.document.close();
          win.print();
        }
      }
    });
  }

  generatePrintableHTML(employees: any[]): string {
    const now = new Date().toLocaleString();
    let html = `<div style="text-align:center;"><h2>Employee List</h2></div><p style="text-align:right;">Printed on: ${now}</p><table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;"><thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Department</th><th>Designation</th><th>Address</th><th>Gender</th><th>DOB</th><th>Joining</th><th>Salary</th></tr></thead><tbody>`;
    employees.forEach(emp => {
      html += `<tr>
      <td>${emp.fullName}</td>
      <td>${emp.email}</td>
      <td>${emp.mobile}</td>
      <td>${emp.department?.departmentName || 'N/A'}</td>
      <td>${emp.designation}</td>
      <td>${emp.address}</td>
      <td>${emp.gender}</td>
      <td>${emp.dateOfBirth}</td>
      <td>${emp.joiningDate}</td>
      <td>${emp.salary}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    return html;
  }
}
