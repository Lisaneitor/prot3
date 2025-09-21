import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingOffersService } from '../../../service/training-offers.service';


@Component({
  selector: 'app-oferta-form',
  standalone: false,
  templateUrl: './oferta-form.component.html',
  styleUrl: './oferta-form.component.css'
})
export class OfertaFormComponent {
  file: File | null = null;
  isDragging = false;
  emailCount: number | null = null;

  constructor(
    private router: Router,
    private trainingOffersService: TrainingOffersService
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

    this.trainingOffersService.uploadCsv(this.file).subscribe({
      next: (res) => {
        alert(res.message || 'Archivo cargado correctamente');
        this.router.navigate(['/admin/oferta']);
      },
      error: (err) => {
        console.error('Error al cargar archivo:', err);
        alert(err?.error?.message || 'Error al cargar archivo');
      }
    });
  }
/*
  descargarPlantilla(): void {
    this.trainingOffersService.getExpectedCsvFormat().subscribe(blob => {
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
  this.trainingOffersService.getCsvFormat().subscribe({
    next: (res) => {
      const csvContent = res.data;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla_ofertas_formativas.csv';
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
