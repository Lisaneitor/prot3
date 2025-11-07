import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la interfaz según tu tabla
export interface Ruta {
  id: number;
  email: string;
  department: string;
  role: string;
  routeName: string;
  hours: number;
  status: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  //private apiUrl = '/api/recommended-learning-paths';
  private apiUrl = 'http://localhost:8080/api/recommended-learning-paths';

  constructor(private http: HttpClient) {}

  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.apiUrl);
  }

deleteRuta(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}


  getRecommendedPaths(page: number = 0, size: number = 100): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdDate')
      .set('direction', 'desc');

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
  
    exportRecommendedPathsCsv() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });

    return this.http.get(`${this.apiUrl}/export/csv`, {
      headers,
      responseType: 'blob' // 👈 importante para recibir un archivo
    });
  }
  getRecommendedPathById(id: number) {
        const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  return this.http.get<any>(`${this.apiUrl}/${id}`, {
    headers  // Si manejas headers con token
  });
}

addOfferToPath(recommendationId: number, offerId: string): Observable<any> {
          const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  return this.http.put(`${this.apiUrl}/${recommendationId}/offers/${offerId}`, {}, { headers });
}

removeOfferFromPath(recommendationId: number, offerId: string) : Observable<any>{
          const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  return this.http.delete(`${this.apiUrl}/${recommendationId}/offers/${offerId}`, { headers });
}

}
