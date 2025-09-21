import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../service/users.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {

  userForm: FormGroup;
  userId!: number;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        const user = res.data;
        this.userForm.patchValue({
          name: user.name,
          role: user.role,
          password: user.password,
          active: user.active
        });
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        alert('No se pudo cargar el usuario');
      }
    });
  }

  actualizarUsuario(): void {
    if (this.userForm.invalid) return;

    const datosActualizados = this.userForm.value;

    this.userService.actualizarUsuario(this.userId, datosActualizados).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente');
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        alert(err?.error?.message || 'Error al actualizar usuario');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/usuarios']);
  }

}
