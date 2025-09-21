import { Component, Input, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() role: 'COLLABORATOR' | 'ADMIN' = 'COLLABORATOR';
  @Input() username: string = 'Cris';

  menuOptions: { label: string, path: string }[] = [];
  menuOpen = false;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.menuOptions = this.role === 'COLLABORATOR'
      ? [
          { label: 'Carga de archivos', path: '/analista/archivos' },
          { label: 'Generar rutas', path: '/analista/generar' },
          { label: 'Rutas activas', path: '/analista/rutas' }
        ]
      : [
          { label: 'Gestión de usuarios', path: '/admin/usuarios' },
          { label: 'Oferta formativa', path: '/admin/oferta' },
          { label: 'Autoevaluación de competencias', path: '/admin/roles' }
        ];
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  vercuenta() {
    this.router.navigate(['cuenta']);
  }
}
