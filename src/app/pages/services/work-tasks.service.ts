import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WorkTasksService {
  private apiUrl = "https://localhost:44362/api/WorkTasks";

  constructor(private http: HttpClient) { }

  getTasksByEmployee(empId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/by-employee/${empId}`);
  }
  //  get admin work tasks


  getAdminTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/all`);
  }

  //  create new work task
  createTask(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // upadate work task
  updateTask(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, data);
  }

  // move task to another status
  moveTask(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/move`, data);
  }
}