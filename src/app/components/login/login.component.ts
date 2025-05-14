import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private loggedIn = false;
  private role: 'analista' | 'admin' | null = null;
  private username: string = '';
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, 
    private router: Router,
  private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onLogin() {
    const { username, password } = this.loginForm.value;

    // Simulación: validación simple según rol
    if (username === 'admin' && password === 'admin123') {
      this.router.navigate(['/admin']);
    this.authService.login('admin', 'admin');
    } else if (username === 'analista' && password === 'analista123') {
      this.router.navigate(['/analista']);
    this.authService.login('analista', 'analista');
    } else {
      alert('Credenciales incorrectas');
    }
  }
  isLoggedIn() {
    return this.loggedIn;
  }

  getRole() {
    return this.role;
  }

  getUsername() {
    return this.username;
  }
}
