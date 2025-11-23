import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44362/api/Employee'; // 🔹 change to your backend endpoint

  constructor(private http: HttpClient) { }

  // Login API call
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string; role: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
        }
      })
    );
  }
  
  // get store role
  getRole(): string | null {
    return localStorage.getItem('role');
  }


  // Save JWT token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  //  NEW: Get Full Name from JWT token
  getUserFullName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      //  Claim key for name (matches your backend JWT)
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }
}
