import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-emp-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emp-assets.html',
  styleUrl: './emp-assets.css'
})
export class EmpAssets implements OnInit {
  assets: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadAssets();
  }

  // decode employee id from Jwt
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
  //  Fetch employee's assigned assets
  loadAssets(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('https://localhost:44362/api/Asset/my-assets', { headers }).subscribe({
      next: (res) => {
        console.log(' Assets fetched:', res);
        this.assets = res;

        //  Manually trigger change detection
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Failed to load assets', err);
      }
    });
  }
}
