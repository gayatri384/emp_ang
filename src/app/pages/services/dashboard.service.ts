import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardModal } from '../dashboard/dashboard.modal';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://localhost:44362/api/dashboard'; 

  constructor(private http: HttpClient) {}

  //  Use correct return type — single object, not array
  getDashboardOverview(): Observable<DashboardModal> {
    return this.http.get<DashboardModal>(`${this.apiUrl}/overview`);
  }
}
