import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genera-rutas',
  standalone: false,
  templateUrl: './genera-rutas.component.html',
  styleUrl: './genera-rutas.component.css'
})
export class GeneraRutasComponent {

  isGenerating = false;
  isComplete = false;
  currentMessage = 'Procesando la información...';

  messages = [
    'Procesando la información...',
    'Analizando perfiles...',
    'Generando rutas personalizadas...',
    'Estableciendo metas de aprendizaje...',
    'Asignando recursos formativos...'
  ];

  constructor(private router: Router) {}

  handleGeneratePaths(): void {
    this.isGenerating = true;
    let messageIndex = 0;

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[messageIndex];
    }, 2500);

    setTimeout(() => {
      clearInterval(interval);
      this.isGenerating = false;
      this.isComplete = true;
    }, 8000);
  }

  goToRoutes(): void {
    this.router.navigate(['/analista/rutas']);
  }

  reset(): void {
    this.isComplete = false;
  }
}
