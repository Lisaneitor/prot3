import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../service/users.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
usuarios: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  columns = [
    { name: 'ID', prop: 'userId', width: 30 },
    { name: 'Nombre', prop: 'name', width: 180 },
    { name: 'Correo', prop: 'email', width: 180 },
    { name: 'Rol', prop: 'role', width: 60 }
    //{ name: 'Acciones', cellTemplate: null } // se usará con templateRef
  ];
 constructor(
  private userService: UserService, 
  private router: Router,
  private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.getUsers().subscribe((response) => {
      this.usuarios = response.data.content;
      this.filteredUsers = [...this.usuarios];
    });
  }

  filtrarUsuarios(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.usuarios.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

eliminarUsuario(userId: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: { userId }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          //alert('Usuario eliminado correctamente');
          Swal.fire({
        title: '¡Listo!',
        text: 'Usuario eliminado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
      });
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          //alert('Error al eliminar usuario');
                Swal.fire({
        title: 'Error al eliminar usuario',
        text: err?.error?.message || 'Ocurrió un error al eliminar usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
      });
        }
      });
    }
  });
}
  editarUsuario(id: number) {
  this.router.navigate(['/admin/editar/usuario', id]);
}

  addUser() {
    this.router.navigate(['admin/agregar/usuario']);
  }

  traducirRol(role: string): string {
  switch (role) {
    case 'COLLABORATOR':
      return 'Analista';
    case 'ADMIN':
      return 'Administrador';
    default:
      return role;
  }
}
}
