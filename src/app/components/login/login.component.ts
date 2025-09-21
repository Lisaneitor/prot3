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
  private role: 'COLLABORATOR' | 'ADMIN' | null = null;
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

// src/app/components/login/login.component.ts
onLogin() {
  const { username, password } = this.loginForm.value;

  this.authService.login(username, password).subscribe({
    next: (res) => {
      const role = res.data.user.role.toLowerCase();

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'collaborator') {
        this.router.navigate(['/analista']);
      } else {
        alert('Rol no reconocido');
      }
        //console.log('Rol actual:', role);

    },
    error: (err) => {
      console.error(err);
      alert('Credenciales inválidas');
    }
  });
  
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
