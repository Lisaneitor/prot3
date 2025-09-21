import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export type UserRole = 'COLLABORATOR' | 'ADMIN';

interface LoginResponse {
  data: {
    token: string;
    tokenType: string;
    user: {
      userId: number;
      name: string;
      email: string;
      role: string;
      admin: boolean;
    };
    expiresIn: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private token: string | null = null;
  private user: any = null;

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch {
        this.user = null;
      }
    }
  }
/*
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        this.token = res.data.token;
        this.user = res.data.user;

        // Guardar en localStorage si se desea persistencia
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      })
    );
  }

  logout() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        this.clearSession(); // aun si falla, borra el token
      }
    });
  }

  private clearSession() {
    this.user = null;
    this.token = '';
    localStorage.removeItem('auth_token');
  }
    */

  login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((res) => {
      this.token = res.data.token;
      this.user = res.data.user;

      // Clave correcta y coherente
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    })
  );
}

logout() {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`
  });

  return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
    next: () => this.clearSession(),
    error: () => this.clearSession()
  });
}

private clearSession() {
  this.user = null;
  this.token = '';
  localStorage.removeItem('token'); // ← aquí estaba el error
  localStorage.removeItem('user');
}


  isLoggedIn(): boolean {
    return !!this.token;
  }

  getUsername(): string {
    return this.user?.name || '';
  }

  getRole(): UserRole | null {
    return this.user?.role || null;
  }
  getToken(): string {
    return this.token || localStorage.getItem('auth_token') || '';
  }

  getUserId(): number | null {
  if (this.user?.userId) {
    return this.user.userId;
  }

  const userFromStorage = localStorage.getItem('user');
  if (userFromStorage) {
    try {
      const parsed = JSON.parse(userFromStorage);
      return parsed.userId ?? null;
    } catch {
      return null;
    }
  }

  return null;
}
getBaseRoute(): string {
  const role = this.getRole();
  return role === 'ADMIN' ? 'admin' : 'analista';
}


}
