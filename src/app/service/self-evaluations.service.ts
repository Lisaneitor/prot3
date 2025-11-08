import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroment/environment'

@Injectable({
  providedIn: 'root'
})
export class SelfEvaluationsService {

    private base = environment.apiBaseUrl;
    private baseUrl  = `${this.base}/self-evaluations`;

  constructor(private http: HttpClient) {}

  getExpectedCsvFormat(): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.baseUrl}/csv-format`, { headers, responseType: 'blob' });
  }

  getCsvFormat(): Observable<{ data: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  return this.http.get<{ data: string }>(
    `${this.baseUrl}/csv-format`
  );
}
  uploadCsv(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(`${this.baseUrl}/upload-csv`, formData, { headers });
  }

}
