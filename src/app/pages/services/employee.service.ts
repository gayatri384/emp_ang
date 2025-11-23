import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Employee } from "../employee/employee.model";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpParams } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class EmployeeService {
    public apiUrl = 'https://localhost:44362/api/Employee'; // your backend endpoint

    constructor(private http: HttpClient) { }

    // Add a new employee
    addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}/register`, employee);
    }

    // Get all employees
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}/list`);
    }

    // Update employee
    updateEmployee(id: number, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/update/${id}`, employee);
    }

    // Verify employee OTP
    verifyOTP(email: string, otp: string) {
        const body = {
            email: email,  // lowercase keys to match backend
            otp: otp
        };

        return this.http.post(
            `${this.apiUrl}/verify-otp`,
            body,
            {
                headers: { 'Content-Type': 'application/json' },
                responseType: 'text' as const
            }
        );
    }

    // for pagination manage employee list with in backend
    getEmployeesPaged(page: number, pageSize: number, search: string = ''): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize)
            .set('search', search);

        return this.http.get(`${this.apiUrl}/list-paged`, { params });
    }

    // Delete employee
    deleteEmployee(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/delete/${id}`);
    }
}