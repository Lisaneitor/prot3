import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../enviroment/environment'

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

    private base = environment.apiBaseUrl;
    private baseUrl  = `${this.base}`;

  constructor(private http: HttpClient) {}

  generateRecommendations(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<any>(`${this.baseUrl}/collaborator-roles?page=0&size=1000`, { headers }).pipe(
      map((res) => res.data.map((c: any) => ({ collaboratorId: c.collaboratorId }))),
      switchMap((payload) =>
        this.http.post(`${this.baseUrl}/recommend`, payload, { headers })
      )
    );
  }

}
