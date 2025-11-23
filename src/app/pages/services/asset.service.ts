import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Asset } from '../assets/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private apiUrl = 'https://localhost:44362/api/Asset';

  constructor(private http: HttpClient) { }

  // Assets CRUD
  getAllAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiUrl);
  }

  addAsset(asset: Asset): Observable<Asset> {
    return this.http.post<Asset>(this.apiUrl, asset);
  }

  updateAsset(asset: Asset): Observable<Asset> {
    return this.http.put<Asset>(`${this.apiUrl}/${asset.id}`, asset);
  }

  deleteAsset(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Assignments
  getAllAssignments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assignments`);
  }

  assignAsset(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.http.post(`${this.apiUrl}/assign`, data, { headers });
  }

  deleteAssignment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assign/${id}`);
  }
  updateAssignment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/assign/${id}`, data);
  }


  getAssetsPaged(page: number = 1, pageSize: number = 10, search: string = ''): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/list-paged?page=${page}&pageSize=${pageSize}&search=${search}`
    );
  }

  // load data in employee dasboard
  getMyAssets(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<any[]>(`${this.apiUrl}/my-assets`, { headers });
  }

}
