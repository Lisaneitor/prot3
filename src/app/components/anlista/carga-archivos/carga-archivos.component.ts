import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
    this.emailCount = Math.floor(Math.random() * 300) + 50; // Simulación
  }

  openFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  handleUpload(): void {
    if (!this.file) return;

    alert(`Archivo "${this.file.name}" cargado exitosamente con ${this.emailCount} correos.`);
    this.router.navigate(['/analyst/generate']);
  }

}
