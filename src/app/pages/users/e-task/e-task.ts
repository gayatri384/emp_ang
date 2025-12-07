import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WorkTaskService } from '../../services/work-task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-e-task',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    DragDropModule
  ],
  templateUrl: './e-task.html',
  styleUrls: ['./e-task.css']
})
export class EmployeeTasksComponent implements OnInit {

  columns = [1, 2, 3, 4];
  tasksByCol: { [key: string]: any[] } = {};

  constructor(
    private taskService: WorkTaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEmployeeTasks();
  }

  getColumnName(col: number) {
    switch (col) {
      case 1: return "Ideas";
      case 2: return "To Do";
      case 3: return "Doing";
      case 4: return "Done";
      default: return "Column";
    }
  }

  getConnectedIds(): string[] {
    return this.columns.map(c => c.toString());
  }

  loadEmployeeTasks() {
    this.taskService.getEmployeeTasks().subscribe(tasks => {
      
      // initialize empty arrays for all columns
      this.tasksByCol = this.columns.reduce((acc: any, c) => {
        acc[c] = [];
        return acc;
      }, {} as any);

      // group tasks by column
      (tasks || []).forEach((t: any) => {
        const key = String(t.columnId ?? 1);
        this.tasksByCol[key].push(t);
      });

      // sort tasks inside each column
      Object.keys(this.tasksByCol).forEach(key => {
        this.tasksByCol[key].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      });

      this.cdr.detectChanges(); // <-- Force refresh
    });
  }

  drop(event: CdkDragDrop<any[]>, toCol: number) {
    const toColKey = String(toCol);
    const fromContainerId = event.previousContainer.id;
    const toContainerId = event.container.id;

    if (!this.tasksByCol[toColKey]) this.tasksByCol[toColKey] = [];

    if (event.previousContainer === event.container) {

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reindexColumn(toColKey);
      const movedTask = event.container.data[event.currentIndex];

      this.updateOrder(movedTask, Number(fromContainerId), Number(toContainerId), event.currentIndex);

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.reindexColumn(String(event.previousContainer.id));
      this.reindexColumn(String(event.container.id));

      const movedTask = event.container.data[event.currentIndex];

      this.updateOrder(movedTask, Number(fromContainerId), Number(toContainerId), event.currentIndex);
    }

    this.cdr.detectChanges(); // <-- Update UI immediately
  }

  private reindexColumn(colKey: string) {
    const list = this.tasksByCol[colKey] || [];
    for (let i = 0; i < list.length; i++) {
      list[i].order = i;
    }
  }

  updateOrder(task: any, fromCol: number, toCol: number, newOrder: number) {
    const payload = {
      taskId: task.id,
      fromColumnId: Number(fromCol),
      toColumnId: Number(toCol),
      newOrder: Number(newOrder)
    };

    console.log("moveTask payload:", payload);

    this.taskService.moveTask(payload).subscribe({
      next: () => {
        // Optional: refresh tasks if needed
        // this.loadEmployeeTasks();
      },
      error: err => console.error("moveTask error", err)
    });
  }
}
