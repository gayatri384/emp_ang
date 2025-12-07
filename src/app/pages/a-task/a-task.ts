import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { WorkTaskService } from '../services/work-task.service';
import { EmployeeService } from '../services/employee.service';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-a-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatSidenavModule,
    MatInputModule
  ],
  templateUrl: './a-task.html',
  styleUrls: ['./a-task.css']
})
export class AdminTasksComponent implements OnInit {

  @ViewChild('drawer') drawer!: MatDrawer;

  tasks: any[] = [];
  filteredTasks: any[] = [];
  employees: any[] = [];

  // FORM MODEL
  form: any = {
    id: null,
    title: '',
    description: '',
    assignedToId: '',
    priority: 'Low',
    dueDate: '',
    columnId: 1, // Default required by backend
    order: 1     // Default required by backend
  };

  isEdit = false;

  constructor(
    private taskService: WorkTaskService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAll();
  }

  // Load employees
  loadEmployees() {
    this.employeeService.getEmployees().subscribe(res => {
      this.employees = res;
      this.cdr.markForCheck();
    });
  }

  // Load all tasks
  loadAll() {
    this.taskService.getAllAdmin().subscribe(res => {
      this.tasks = res;
      this.filteredTasks = res;
      this.cdr.markForCheck();
    });
  }

  // Filter tasks by employee
  filterByEmployee(empId: any): void {
    if (!empId) {
      this.filteredTasks = this.tasks;
      this.cdr.markForCheck();
      return;
    }

    this.taskService.getByEmployee(empId).subscribe(res => {
      this.filteredTasks = res;
      this.cdr.markForCheck();
    });
  }

  // Open drawer for Add Task
  openAdd() {
    this.isEdit = false;

    this.form = {
      id: null,
      title: '',
      description: '',
      assignedToId: null,
      priority: 'Low',
      dueDate: null,

      // Required fields for backend
      columnId: 1,
      order: 1
    };

    this.drawer.open();
  }

  // Edit Task
  onEdit(task: any) {
    this.isEdit = true;

    this.form = {
      id: task.id,
      title: task.title,
      description: task.description,
      assignedToId: task.assignedToId,
      priority: task.priority,
      dueDate: task.dueDate,
      columnId: task.columnId ?? 1,
      order: task.order ?? 1
    };

    this.drawer.open();
  }

  // Save Add/Edit Task
  saveTask() {
  const payload = {
    id: this.form.id,
    title: this.form.title,
    description: this.form.description,

    assignedToId: Number(this.form.assignedToId), // FIX

    priority: this.form.priority,
    dueDate: this.form.dueDate || null,

    columnId: Number(this.form.columnId), // FIX
    order: Number(this.form.order)        // FIX
  };

  console.log("Payload Sent:", payload); // DEBUG

  if (this.isEdit) {
    this.taskService.updateTask(payload).subscribe(() => {
      this.loadAll();
      this.drawer.close();
    });
  } else {
    this.taskService.createTask(payload).subscribe({
      next: () => {
        this.loadAll();
        this.drawer.close();
      },
      error: (err) => {
        console.error("Create Task Error:", err.error);  
      }
    });
  }
}

}
