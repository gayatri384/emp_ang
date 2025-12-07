import { Component, OnInit } from '@angular/core';
import { WorkTasksService } from '../services/work-tasks.service';
import { EmployeeService } from '../services/employee.service';
import Kanban from "jkanban";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './kanban-board.html',
  styleUrls: ['./kanban-board.css']
})
export class KanbanBoard implements OnInit {

  kanban: any;
  kanbanData: any = [];
  employees: any[] = [];
  selectedEmployeeId: number = 0;

  constructor(
    private taskService: WorkTasksService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadTasks();
  }

  /** Load employees for admin filter dropdown */
  loadEmployees() {
    this.employeeService.getEmployees().subscribe((res: any) => {
      this.employees = res;
    });
  }

  /** Filter tasks for selected employee */
  filterByEmployee() {
    if (this.selectedEmployeeId === 0) {
      this.loadTasks();
    } else {
      this.taskService.getTasksByEmployee(this.selectedEmployeeId).subscribe((tasks: any) => {
        this.buildKanban(tasks);
      });
    }
  }

  /** Load all tasks (default admin view) */
  loadTasks() {
    this.taskService.getAdminTasks().subscribe((tasks: any) => {
      this.buildKanban(tasks);
    });
  }

  /** Build Kanban board data structure */
  buildKanban(tasks: any[]) {
    const grouped: any = {};

    tasks.forEach((t: any) => {
      if (!grouped[t.columnId]) grouped[t.columnId] = [];
      grouped[t.columnId].push({
        id: t.id,
        title: t.title,
        description: t.description
      });
    });

    this.kanbanData = Object.keys(grouped).map(col => ({
      id: col,
      title: `Column ${col}`,
      item: grouped[col]
    }));

    this.renderKanban();
  }

  /** Render Kanban board */
  renderKanban() {
    if (this.kanban) {
      document.getElementById("kanban")!.innerHTML = ""; 
    }

    this.kanban = new Kanban({
      element: "#kanban",
      boards: this.kanbanData,

      dropEl: (element: any, target: any, source: any) => {
        const moveData = {
          taskId: Number(element.dataset.eid),
          fromColumnId: Number(source.parentElement.dataset.id),
          toColumnId: Number(target.parentElement.dataset.id),
          newOrder: [...target.children].indexOf(element)
        };

        this.taskService.moveTask(moveData).subscribe(() => {
          console.log("Task moved");
        });
      }
    });
  }
}
