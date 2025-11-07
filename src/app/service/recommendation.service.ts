import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  //private baseUrl = '/api';
  private baseUrl = 'http://localhost:8080/api';

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
