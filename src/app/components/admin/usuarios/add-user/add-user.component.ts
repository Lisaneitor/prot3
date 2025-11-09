import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../service/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  userForm: FormGroup;
  mostrarPassword: boolean = false;
  emailDuplicado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
  this.userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ]],
    role: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
  });

      this.userForm.get('email')?.valueChanges.subscribe(() => {
      if (this.emailDuplicado) {
        const control = this.userForm.get('email');
        this.emailDuplicado = null;
        if (control?.errors?.['duplicate']) {
          const { duplicate, ...rest } = control.errors;
          control.setErrors(Object.keys(rest).length ? rest : null);
        }
      }
    });

  }

  guardarUsuario() {
   /* if (this.userForm.valid) {
      const nuevoUsuario = {
        ...this.userForm.value,
        active: true
      };

      this.userService.crearUsuario(nuevoUsuario).subscribe({
        next: () => {
          //alert('Usuario creado exitosamente');
          //this.router.navigate(['/admin/usuarios']);
                Swal.fire({
        title: '¡Listo!',
        text: 'Usuario creado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ir a usuarios',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        this.router.navigate(['/admin/usuarios']);
      });
        },
        error: (err) => {
          //const errorMsg = err?.error?.error || 'Error al crear usuario';
          //alert(errorMsg);
          console.error('Error al crear usuario:', err);
                Swal.fire({
        title: 'Error al crear usuario',
        text: err?.error?.message || 'Error al crear usuario',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
        }
      });*/

          if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      const emailControl = this.userForm.get('email');
      if (emailControl?.errors?.['duplicate']) {
        const emailValue = emailControl.value || '';
        //alert(`El correo ya existe: ${emailValue}`);
        Swal.fire({
          title: 'Error al crear usuario',
          text: `El correo ya existe: ${emailValue}`,   // template string
          icon: 'error',
          confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
        });
      } else {
        Swal.fire({
        title: 'Error al crear usuario',
        text: 'No se pudo guardar los cambios. Verifique que todos los campos estén completos correctamente',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
      });      }
      return;
    }
    const nuevoUsuario = {
      ...this.userForm.value,
      active: true
    };

    this.userService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        //alert('Usuario creado exitosamente');
        //this.router.navigate(['/admin/usuarios']);
        Swal.fire({
        title: '¡Listo!',
        text: 'Usuario creado exitosamente',
        icon: 'success',
        confirmButtonText: 'Ir a Gestión de usuarios',
        allowOutsideClick: false,
        allowEscapeKey: false,
      confirmButtonColor: '#01C4B3'
      }).then(() => {
        this.router.navigate(['/admin/usuarios']);
      });
      },
      error: (err) => {
        //const errorMsg = err?.error?.error || 'Error al crear usuario';
        //alert(errorMsg);

      const emailControl = this.userForm.get('email');
        const emailValue = emailControl?.value || '';
        const backendMessage = (err?.error?.message || err?.error?.error || '').toString();
        const duplicatePattern = /(existe|exist|duplic|unique)/i;
        const isDuplicate = err?.status === 409 || (backendMessage && duplicatePattern.test(backendMessage));

        if (isDuplicate) {
          this.emailDuplicado = emailValue;
          if (emailControl) {
            const currentErrors = emailControl.errors || {};
            emailControl.setErrors({ ...currentErrors, duplicate: true });
            emailControl.markAsTouched();
          }
          //alert(`El correo ya existe: ${emailValue}`);
          Swal.fire({
  title: 'Error al crear usuario',
  text: `El correo ya existe: ${emailValue}`,   // template string
  icon: 'error',
  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
});
        } else {
          const errorMsg = backendMessage || 'Error al crear usuario';
                    //alert(errorMsg);
                                            Swal.fire({
        title: 'Error al crear usuario',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
      });
                    
        }
        console.error('Error al crear usuario:', err);
      }
    });
  }
  
  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
  
}
