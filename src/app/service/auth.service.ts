import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private loggedIn = false;
  private username = '';
  private role: 'analista' | 'admin' | null  = null ;

  login(username: string, role: 'analista' | 'admin') {
    this.loggedIn = true;
    this.username = username;
    this.role = role;
  }

  logout() {
    this.loggedIn = false;
    this.username = '';
    this.role = null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getUsername(): string {
    return this.username;
  }

  getRole(): 'analista' | 'admin' | null {
    return this.role;
  }
}
