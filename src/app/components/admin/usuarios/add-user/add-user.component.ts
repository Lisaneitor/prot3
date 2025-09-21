import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../service/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  userForm: FormGroup;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
  this.userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
  });

  }

  guardarUsuario() {
    if (this.userForm.valid) {
      const nuevoUsuario = {
        ...this.userForm.value,
        active: true
      };

      this.userService.crearUsuario(nuevoUsuario).subscribe({
        next: () => {
          alert('Usuario creado exitosamente');
          this.router.navigate(['/admin/usuarios']);
        },
        error: (err) => {
          const errorMsg = err?.error?.error || 'Error al crear usuario';
          alert(errorMsg);
          console.error('Error al crear usuario:', err);
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
  
}
