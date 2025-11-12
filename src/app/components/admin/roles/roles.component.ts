import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SelfEvaluationsService } from '../../../service/self-evaluations.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  file: File | null = null;
  isDragging = false;
  emailCount: number | null = null;

  constructor(
    private router: Router,
    private selfEvaluationsService: SelfEvaluationsService
  ) {}

  handleFileChange(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.handleFileSelection(selectedFile);
    }
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const droppedFile = event.dataTransfer?.files?.[0];
    if (droppedFile) {
      this.handleFileSelection(droppedFile);
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  handleDragLeave(): void {
    this.isDragging = false;
  }

  handleFileSelection(file: File): void {
    if (!file.name.endsWith('.csv')) {
      alert('Por favor, seleccione un archivo CSV');
      return;
    }

    this.file = file;
  }

  openFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  handleUpload(): void {
    if (!this.file) return;

    this.selfEvaluationsService.uploadCsv(this.file).subscribe({
      next: (res) => {
       // alert(res.message || 'Archivo cargado correctamente');
        //this.router.navigate(['/admin/oferta']);
        Swal.fire({
                title: '¡Listo!',
                text: 'Archivo cargado correctamente',
                icon: 'success',
                confirmButtonText: 'volver',
                allowOutsideClick: false,
                allowEscapeKey: false,
      confirmButtonColor: '#01C4B3'
              }).then(() => {
                this.router.navigate(['/admin/roles']);
              });
      },
      error: (err) => {
        console.error('Error al cargar archivo:', err);
        //alert(err?.error?.message || 'Error al cargar archivo');
              Swal.fire({
        title: 'Error al cargar archivo',
        text: err?.error?.message || 'Revisa el contenido del archivo',
        icon: 'error',
        confirmButtonText: 'volver',
      confirmButtonColor: '#01C4B3'
      });
      }
    });
  }
/*
  descargarPlantilla(): void {
    this.collaboratorRolesService.getExpectedCsvFormat().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_ofertas_formativas.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
    */

descargarPlantilla(): void {
  this.selfEvaluationsService.getCsvFormat().subscribe({
    next: (res) => {
      const csvContent = res.data;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_autoevaluacion.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error al descargar plantilla:', err);
      //alert('No se pudo obtener la plantilla. Intenta nuevamente.');
                  Swal.fire({
              title: 'Error al descargar',
              text: err?.error?.message || 'No se pudo obtener la plantilla. Intenta nuevamente',
              icon: 'error',
              confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
            });
    }
  });
}
}
