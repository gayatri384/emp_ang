import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Department } from "../department/department.model";
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class DepartmentService {
  private apiUrl = "https://localhost:44362/api/Department"; // backend endpoint

  constructor(private http: HttpClient) { }

  // Add a new department
  addDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/add`, department);
  }

  // Get all departments
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}`);
  }

  // Update department
  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/update/${id}`, department);
  }

  // Delete department
  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // pagination and search
  getDepartmentsPaged(page: number = 1, pageSize: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search.trim() !== '') {
      params = params.set('search', search);
    }

    return this.http.get(`${this.apiUrl}/list-paged`, { params });
  }
}
