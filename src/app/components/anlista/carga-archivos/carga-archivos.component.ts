import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CollaboratorRolesService } from '../../../service/collaborator-roles.service';
import { UploadStateService } from '../../../service/upload-state.service';

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
      next: (res) => {
      this.uploadStateService.markUploaded(true);
        alert(res.message || 'Archivo cargado correctamente');
        this.router.navigate(['/analista/generar']);
      },
      error: (err) => {
      this.uploadStateService.markUploaded(false);
        console.error('Error al cargar archivo:', err);
        alert(err?.error?.message || 'Error al cargar archivo');
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
      alert('No se pudo obtener la plantilla. Intenta nuevamente.');
    }
  });
}

}
