import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkTaskService {

    private baseUrl = 'https://localhost:44362/api/WorkTasks';

    constructor(private http: HttpClient) { }


    getAll(): Observable<any> {
        return this.http.get(`${this.baseUrl}`);
    }
    // ADMIN
    getAllAdmin(): Observable<any> {
        return this.http.get(`${this.baseUrl}/admin/all`);
    }

    getByEmployee(empId: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/admin/by-employee/${empId}`);
    }

    // EMPLOYEE
    getEmployeeTasks(): Observable<any> {
        return this.http.get(`${this.baseUrl}/employee`);
    }

    // CRUD
    createTask(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/create`, data);
    }

    updateTask(data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/update`, data);
    }

    moveTask(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/move`, data);
    }
}
