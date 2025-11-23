import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Leave } from '../leave/leave.model';
import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'https://localhost:44362/api/Leave';  // 🔗 Your API base

  constructor(private http: HttpClient) { }

  // Extract employeeId from JWT token
  getEmployeeIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      const empId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      return empId ? Number(empId) : null;
    } catch (err) {
      console.error('Invalid token', err);
      return null;
    }
  }

  // Apply leave API
  applyLeave(leaveData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Applying leave with payload:', leaveData);
    return this.http.post<any>(`${this.apiUrl}/apply`, leaveData, { headers });
  }

  // Fetch all leaves
  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.apiUrl);
  }

  // Update leave status
  // Update leave status (Approve/Reject)
  updateLeaveStatus(leaveId: number, status: string): Observable<any> {
    const body = { leaveId, status };
    return this.http.post(`${this.apiUrl}/update-status`, body);
  }

  // Delete leave (if you add delete endpoint later)
  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get login employee leave
  getMyLeaves(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/my-leaves`, { headers });
  }


  // Get Employee Leaves
  getEmployeeLeaves(): Observable<any[]> {
    const employeeId = this.getEmployeeIdFromToken();
    if (!employeeId) return new Observable((observer) => observer.next([])); // return empty if not logged in

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Fetch all leaves and filter on frontend by employeeId
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  // for t
  getLeavesPaged(page: number, pageSize: number, search: string = "") {
    return this.http.get(
      `${this.apiUrl}/list-paged?page=${page}&pageSize=${pageSize}&search=${search}`
    );
  }


}
