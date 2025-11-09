import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutasService } from '../../../../service/rutas.service';
import { EditPathService } from '../../../../service/edit-path.service';
import { Observable, from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

interface PathOperation {
  type: 'add' | 'remove';
  offerId: string;
  execute: () => Observable<any>;
}

@Component({
  selector: 'app-edit-path',
  standalone: false,
  templateUrl: './edit-path.component.html',
  styleUrl: './edit-path.component.css'
})
export class EditPathComponent implements OnInit{
  rutaId!: number;
  cursos: any[] = [];
  originalOffers: any[] = [];
  isSaving = false;
  private currentOperation: PathOperation | null = null;
  
  constructor(
    private rutasService: RutasService,
    private editPathService: EditPathService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

ngOnInit(): void {
  this.rutaId = Number(this.route.snapshot.paramMap.get('id'));

  const cachedRutaId = this.editPathService.getRutaId();
  const cachedCursos = this.editPathService.getCursos();
  const cachedOriginal = this.editPathService.getOriginalOffers();

  if (cachedRutaId === this.rutaId && cachedCursos.length > 0 && cachedOriginal.length > 0) {
    this.cursos = [...cachedCursos];
    this.originalOffers = [...cachedOriginal];
    this.handleNewOfferFromHistoryState(); // ✅ ya hay cursos cargados
  } else {
    this.loadPathFromBackend(); // ✅ aqui adentro llamaremos a handleNewOfferFromHistoryState() después de setear cursos
  }
}


private loadPathFromBackend(): void {
  this.rutasService.getRecommendedPathById(this.rutaId).subscribe({
    next: (res) => {
      const backendCursos = res?.data?.trainingOffers ?? [];

      // ✅ Asigna lo que trae el backend
      this.originalOffers = [...backendCursos];
      this.cursos = [...backendCursos];

      // ✅ Sincroniza el estado compartido
      this.editPathService.setOriginalOffers(this.originalOffers);
      this.editPathService.setRuta(this.rutaId, this.cursos);

      // ✅ Ahora que ya hay cursos, procesa oferta venida por history.state
      this.handleNewOfferFromHistoryState();
    },
    error: (err) => {
      console.error('Error al obtener la ruta desde el backend:', err);
          Swal.fire({
                  title: 'Error al cargar información',
                  text: 'No se pudo cargar la ruta. Por favor, intente de nuevo',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
                });
      this.router.navigate(['/analista/rutas']); // o '/analista/rutas-activas'
    }
  });
}


  private handleNewOfferFromHistoryState(): void {
    const nuevaOferta = history.state.nuevaOferta;
    if (nuevaOferta && nuevaOferta.offerId) {
      const yaExiste = this.cursos.some(c => c.offerId === nuevaOferta.offerId);
      if (!yaExiste) {
        this.cursos = [...this.cursos, nuevaOferta];
        this.editPathService.setRuta(this.rutaId, this.cursos);
      }
            history.replaceState({}, document.title, location.href);
    }
  }

    eliminarCurso(index: number): void {
    if (index < 0 || index >= this.cursos.length) {
          console.warn('Índice inválido al intentar eliminar un curso.');
      return;
    }
        this.cursos.splice(index, 1);
 this.cursos = [...this.cursos];
    this.editPathService.setRuta(this.rutaId, this.cursos);
  }

  cancelar(): void {
        this.editPathService.clear();
 this.router.navigate(['/analista/rutas']);
  }

    guardar(): void {
    const original = this.editPathService.getOriginalOffers();
        if (!original || original.length === 0) {
 }

    const currentOfferIds = new Set(this.cursos.map(c => c.offerId));
    const originalOfferIds = new Set(original.map(c => c.offerId));

        const addedOffers = this.cursos.filter(c => c.offerId && !originalOfferIds.has(c.offerId));
    const removedOffers = original.filter(c => c.offerId && !currentOfferIds.has(c.offerId));
    const operations: PathOperation[] = [
      ...removedOffers.map(offer => ({
        type: 'remove' as const,
        offerId: offer.offerId,
        execute: () => this.rutasService.removeOfferFromPath(this.rutaId, offer.offerId)
      })),
      ...addedOffers.map(offer => ({
        type: 'add' as const,
        offerId: offer.offerId,
        execute: () => this.rutasService.addOfferToPath(this.rutaId, offer.offerId)
      }))
    ];

    if (operations.length === 0) {
                Swal.fire({
                  title: 'Advertencia',
                  text: 'No hay cambios por guardar',
                  icon: 'warning',
                  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
                }).then(() => {
        this.router.navigate(['/analista/rutas']);
      });
      return;
    }
 this.isSaving = true;

    from(operations).pipe(
      concatMap(operation => {
        this.currentOperation = operation;
        return operation.execute();
      }),
      finalize(() => {
        this.isSaving = false;
        this.currentOperation = null;
      })
    ).subscribe({
      complete: () => {
        
                Swal.fire({
                  title: '¡Listo!',
                  text: 'Ruta actualizada correctamente',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
                })
                this.originalOffers = [...this.cursos];

                 this.editPathService.setOriginalOffers(this.originalOffers);
        this.editPathService.clear();
        this.router.navigate(['/analista/rutas']);
      },
      error: (err) => {
        console.error('Error al actualizar la ruta:', err);
         Swal.fire({
                  title: 'Error al actualizar la ruta',
                  text: this.buildOperationErrorMessage(err),
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
                });
      }
    });
  }

  addCurso(): void {
     this.editPathService.setRuta(this.rutaId, this.cursos);
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  private buildOperationErrorMessage(err: any): string {
    let baseMessage = 'Ocurrió un error al actualizar la ruta.';

    if (this.currentOperation) {
      const action = this.currentOperation.type === 'add' ? 'añadir' : 'eliminar';
      baseMessage += ` No se pudo ${action} la oferta ${this.currentOperation.offerId}.`;
    }

    if (err?.status === 400) {
      if (err.error?.message) {
        baseMessage += ` Detalle: ${err.error.message}`;
      } else if (err.error?.error?.includes('could not execute statement')) {
        baseMessage += ' Posible oferta duplicada o inexistente.';
      }
    }

    return baseMessage;
  }
}