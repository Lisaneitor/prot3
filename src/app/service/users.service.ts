// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  //private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  /*getUsers(token: string, page = 0, size = 10, sort = 'name', direction = 'asc'): Observable<UserPageResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('direction', direction);

    return this.http.get<UserPageResponse>(this.apiUrl, { headers, params });
  }*/
    getUsers(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }


  crearUsuario(usuario: any): Observable<any> {
    const token = localStorage.getItem('token'); // No 'auth_token'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, usuario, { headers });
  }

getUserById(id: number): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });
  return this.http.get(`${this.apiUrl}/${id}`, { headers });
}

actualizarUsuario(id: number, data: any): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });
  return this.http.put(`${this.apiUrl}/${id}`, data, { headers });
}

deleteUser(id: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}



}
