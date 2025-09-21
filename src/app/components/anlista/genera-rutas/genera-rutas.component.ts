import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RecommendationService } from '../../../service/recommendation.service';

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

  constructor(private router: Router, private http: HttpClient, 
    private recommendationService: RecommendationService) {}

  /*
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
*/

 handleGeneratePaths(): void {
    this.isGenerating = true;
    let messageIndex = 0;

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[messageIndex];
    }, 2500);

    this.recommendationService.generateRecommendations().subscribe({
      next: () => {
        clearInterval(interval);
        this.isGenerating = false;
        this.isComplete = true;
      },
      error: (err) => {
        clearInterval(interval);
        this.isGenerating = false;
        console.error('Error generando recomendaciones:', err);
        alert('Ocurrió un error al generar las rutas.');
      }
    });
  }

  goToRoutes(): void {
    this.router.navigate(['/analista/rutas']);
  }

  reset(): void {
    this.isComplete = false;
  }
}
