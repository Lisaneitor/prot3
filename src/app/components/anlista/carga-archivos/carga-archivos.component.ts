import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CollaboratorRolesService } from '../../../service/collaborator-roles.service';
import { UploadStateService } from '../../../service/upload-state.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-carga-archivos',
  standalone: false,
  templateUrl: './carga-archivos.component.html',
  styleUrl: './carga-archivos.component.css'
})
export class CargaArchivosComponent {
  file: File | null = null;
  isDragging = false;
  emailCount: number | null = null;

  constructor(
    private router: Router,
    private collaboratorRolesService: CollaboratorRolesService,
    private uploadStateService: UploadStateService
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

  this.collaboratorRolesService.uploadCsv(this.file).subscribe({
    next: () => {
      this.uploadStateService.markUploaded(true);

      Swal.fire({
        title: '¡Listo!',
        text: 'Archivo CSV procesado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ir a rutas',
        allowOutsideClick: false,
        allowEscapeKey: false,
      confirmButtonColor: '#01C4B3'
      }).then(() => {
        this.router.navigate(['/analista/generar']);
      });
    },
    error: (err) => {
      this.uploadStateService.markUploaded(false);
      console.error('Error al cargar archivo:', err);

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
  
descargarPlantilla(): void {
  this.collaboratorRolesService.getCsvFormat().subscribe({
    next: (res) => {
      const csvContent = res.data;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_informacion.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error al descargar plantilla:', err);
     // alert('No se pudo obtener la plantilla. Intenta nuevamente.');
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
