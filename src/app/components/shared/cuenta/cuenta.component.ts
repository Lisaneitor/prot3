import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta',
  standalone: false,
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent implements OnInit {

  userData: any = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.userData = res.data;
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario', err);
        }
      });
    }
  }
  goToInicio(): void {
  const base = this.authService.getBaseRoute();
  this.router.navigate([`/${base}`]); // o `oferta`, `rutas`, etc.
}

  
}
