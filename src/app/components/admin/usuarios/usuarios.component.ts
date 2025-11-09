import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../service/users.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';


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
  pageSizes = [5, 10, 15, 20];
selectedPageSize = 5;

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
/*
eliminarUsuario(userId: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    maxWidth: '90vw',
    autoFocus: false,
    disableClose: true,
    panelClass: 'confirm-dialog-panel',
    data: {
      userId,
      title: 'Advertencia',
      message: `¿Deseas eliminar al usuario con ID ${userId}?`
    }
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
*/
async eliminarUsuario(userId: number) {
  const result = await Swal.fire({
    title: 'Advertencia',
    html: `¿Deseas eliminar al usuario con ID <b>${userId}</b>?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    confirmButtonColor: '#01C4B3',
    cancelButtonColor: '#eb6464ff',
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: () => {
      // Ejecuta el borrado y, si falla, muestra el mensaje sin cerrar el modal.
      return firstValueFrom(this.userService.deleteUser(userId))
        .catch((err: any) => {
          const msg = err?.error?.message || 'Ocurrió un error al eliminar usuario';
          Swal.showValidationMessage(msg);
        });
    }
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: '¡Listo!',
      text: 'Usuario eliminado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
    });
    this.cargarUsuarios();
  }
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
