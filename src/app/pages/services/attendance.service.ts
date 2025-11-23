import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'https://localhost:44362/api/Attendance';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Employee mark attendance
  markAttendance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark`, data, { headers: this.getAuthHeaders() });
  }

  // Employee view attendance
  getEmployeeAttendance(from: string, to: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/me?from=${from}&to=${to}`, { headers: this.getAuthHeaders() });
  }

  // Admin get attendance for specific date
  getAllAttendance(date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/date?date=${date}`, { headers: this.getAuthHeaders() });
  }

  // Admin create/update attendance (Upsert)
  upsertAttendance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/upsert`, data, { headers: this.getAuthHeaders() });
  }

  // Admin get all attendance (with optional employee filters)
  getAllEmployeeAttendance(employeeId?: number, employeeName?: string): Observable<any> {
    let params: any = {};

    if (employeeId) params.employeeId = employeeId;
    if (employeeName) params.employeeName = employeeName;

    return this.http.get(`${this.apiUrl}/admin/all`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

}
