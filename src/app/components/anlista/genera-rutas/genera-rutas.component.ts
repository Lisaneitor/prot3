import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RecommendationService } from '../../../service/recommendation.service';
import { UploadStateService } from '../../../service/upload-state.service';
import { ProcessStateService } from '../../../service/process-state.service';
import { Subscription, interval } from 'rxjs';

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
  canGenerate = false;

    private msgSub?: Subscription;
  private stateSub?: Subscription;

  messages = [
    'Procesando la información...',
    'Analizando perfiles...',
    'Generando rutas personalizadas...',
    'Estableciendo metas de aprendizaje...',
    'Asignando recursos formativos...'
  ];

  constructor(private router: Router, private http: HttpClient, 
    private recommendationService: RecommendationService,
    private uploadState: UploadStateService,
    private processState: ProcessStateService) {}

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

ngOnInit(): void {
    this.stateSub = this.uploadState.uploadedCsv$.subscribe(
      (uploaded) => (this.canGenerate = uploaded)
    );
  }
  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
    this.stateSub?.unsubscribe();
  }

  onGenerateClick(): void {
    if (!this.canGenerate) {
      alert('No puedes generar rutas porque aún no hay ningún archivo CSV cargado.');
      return;
    }
    this.handleGeneratePaths();
  }
 handleGeneratePaths(): void {
    this.isGenerating = true;
    let messageIndex = 0;
    this.processState.setProcessing(true);   // 🔒 bloquear navbar

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[messageIndex];
    }, 2500);

    this.recommendationService.generateRecommendations().subscribe({
      next: () => {
        clearInterval(interval);
        this.isGenerating = false;
        this.isComplete = true;
        this.processState.setProcessing(false); // 🔓 desbloquear navbar
      },
      error: (err) => {
        clearInterval(interval);
        this.isGenerating = false;
        this.processState.setProcessing(false); // 🔓 desbloquear navbar
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
