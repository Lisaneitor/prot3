import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RecommendationService } from '../../../service/recommendation.service';
import { UploadStateService } from '../../../service/upload-state.service';
import { ProcessStateService } from '../../../service/process-state.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-genera-rutas',
  standalone: false,
  templateUrl: './genera-rutas.component.html',
  styleUrl: './genera-rutas.component.css'
})
export class GeneraRutasComponent implements OnInit, OnDestroy {

  isGenerating = false;
  isComplete = false;
  currentMessage = 'Procesando la información...';
  canGenerate = false;

  private stateSub?: Subscription;
  private generateSub?: Subscription;
  private messageIntervalId?: number;

  messages = [
    'Procesando la información...',
    'Analizando perfiles...',
    'Generando rutas personalizadas...',
    'Estableciendo metas de aprendizaje...',
    'Asignando recursos formativos...'
  ];

  constructor(private router: Router, 
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
    if (this.processState.current) {
      this.isGenerating = true;
      this.isComplete = false;
    }
  }
  ngOnDestroy(): void {
    this.clearMessageInterval();
    this.generateSub?.unsubscribe();
    this.stateSub?.unsubscribe();
  }

    @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.processState.current) {
      event.preventDefault();
      event.returnValue = 'Aún se están generando rutas. ¿Deseas salir de todos modos?';
    }
  }

  onGenerateClick(): void {
    if (!this.canGenerate) {
            Swal.fire({
              title: 'Error al generar rutas',
              text: 'No puedes generar rutas porque aún no hay ningún archivo CSV cargado',
              icon: 'error',
              confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
            });
      return;
    }
    this.handleGeneratePaths();
  }
 handleGeneratePaths(): void {
    this.isGenerating = true;
    this.isComplete = false;
    this.processState.setProcessing(true);   // 🔒 bloquear navbar
    this.generateSub?.unsubscribe();
    let messageIndex = 0;
    this.currentMessage = this.messages[0];

    this.messageIntervalId = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[messageIndex];
    }, 2500);

    this.generateSub = this.recommendationService.generateRecommendations()
      .pipe(
        finalize(() => {
          this.clearMessageInterval();
          this.isGenerating = false;
          this.currentMessage = this.messages[0];
          this.processState.setProcessing(false); // 🔓 desbloquear navbar
        })
      )
      .subscribe({
        next: () => {
          this.isComplete = true;
          this.uploadState.reset();
        },
        error: (err) => {
          this.isComplete = false;
          console.error('Error generando recomendaciones:', err);
          //alert('Ocurrió un error al generar las rutas.');
              Swal.fire({
                  title: 'Error al generar las rutas',
                  text: 'Ocurrió un error al generar las rutas',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
                });
        }
      });
  }

  goToRoutes(): void {
    this.router.navigate(['/analista/rutas']);
  }

  reset(): void {
    this.isComplete = false;
  }
  private clearMessageInterval(): void {
    if (this.messageIntervalId !== undefined) {
      window.clearInterval(this.messageIntervalId);
      this.messageIntervalId = undefined;
    }
  }
}
