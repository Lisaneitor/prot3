import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutasService } from '../../../../service/rutas.service';
import { EditPathService } from '../../../../service/edit-path.service';
import { EMPTY, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  ofertasAgregadas: Set<string> = new Set<string>();

  
  constructor(
    private rutasService: RutasService,
    private editPathService: EditPathService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /*
  ngOnInit(): void {
    this.rutaId = Number(this.route.snapshot.paramMap.get('id'));

    this.rutasService.getRecommendedPathById(this.rutaId).subscribe({
      next: (res) => {
        this.cursos = res.data.trainingOffers;
        this.editPathService.setRuta(this.rutaId, this.cursos); // sincroniza el estado compartido

      },
      error: (err) => {
        console.error('Error al obtener la ruta:', err);
      }
    });
  }
    */

  /*
  ngOnInit(): void {
  this.rutaId = Number(this.route.snapshot.paramMap.get('id'));

  const cursosTemporales = this.editPathService.getCursos();
  if (cursosTemporales.length > 0) {
    this.cursos = [...cursosTemporales];  // Clonar para evitar mutación directa
  } else {
    this.rutasService.getRecommendedPathById(this.rutaId).subscribe({
      next: (res) => {
        this.cursos = res.data.trainingOffers;
        this.originalOffers = [...res.data.trainingOffers];
        this.editPathService.setRuta(this.rutaId, this.cursos);
      },
      error: (err) => {
        console.error('Error al obtener la ruta:', err);
      }
    });
  }

  // ✅ Este bloque debe venir *después* de setear cursos
  const nuevaOferta = history.state.nuevaOferta;
  if (nuevaOferta && nuevaOferta.offerId) {
    this.cursos.push(nuevaOferta);
    this.ofertasAgregadas.add(nuevaOferta.offerId);
    this.editPathService.setRuta(this.rutaId, this.cursos);
    this.cursos = [...this.cursos];  // refrescar visual
  }
  }
  */
 ngOnInit_2(): void {
    this.rutaId = Number(this.route.snapshot.paramMap.get('id'));

    this.rutasService.getRecommendedPathById(this.rutaId).subscribe({
      next: (res) => {
        const backendCursos = res.data.trainingOffers;
        this.originalOffers = [...backendCursos];

        const cursosTemporales = this.editPathService.getCursos();
        if (cursosTemporales.length > 0) {
          this.cursos = [...cursosTemporales];
        } else {
          this.cursos = [...backendCursos];
          this.editPathService.setRuta(this.rutaId, this.cursos);
        }

        const nuevaOferta = history.state.nuevaOferta;
        if (nuevaOferta && nuevaOferta.offerId) {
          const yaExiste = this.cursos.some(c => c.offerId === nuevaOferta.offerId);
          if (!yaExiste) {
            this.cursos.push(nuevaOferta);
            this.editPathService.setRuta(this.rutaId, this.cursos);
            this.cursos = [...this.cursos];  // refrescar visual
          }
        }
      },
      error: (err) => {
        console.error('Error al obtener la ruta:', err);
      }
    });
  }
  
 ngOnInit(): void {
    this.rutaId = Number(this.route.snapshot.paramMap.get('id'));

    // Try to load from the service's cache first
    const cursosTemporales = this.editPathService.getCursos();
    const originalOffersCache = this.editPathService.getOriginalOffers();

    if (cursosTemporales.length > 0 && originalOffersCache.length > 0 && this.editPathService.getRutaId() === this.rutaId) {
      // If cached data exists and belongs to the current path, use it
      this.cursos = [...cursosTemporales];
      this.originalOffers = [...originalOffersCache];
    } else {
      // Otherwise, load from the backend
      this.loadPathFromBackend();
    }

    // Handle any new offer passed via navigation state (e.g., from an "Add Course" page)
    this.handleNewOfferFromHistoryState();
  }

  private loadPathFromBackend(): void {
    this.rutasService.getRecommendedPathById(this.rutaId).subscribe({
      next: (res) => {
        const backendCursos = res.data.trainingOffers;
        this.originalOffers = [...backendCursos]; // THIS IS THE SOURCE OF TRUTH FROM BACKEND
        this.cursos = [...backendCursos]; // Initialize current courses with backend data

        // Synchronize the shared service immediately after successful backend load
        this.editPathService.setOriginalOffers(this.originalOffers);
        this.editPathService.setRuta(this.rutaId, this.cursos);
      },
      error: (err) => {
        console.error('Error al obtener la ruta desde el backend:', err);
        alert('No se pudo cargar la ruta. Por favor, intente de nuevo.');
        this.router.navigate(['/analista/rutas']); // Redirect if loading fails
      }
    });
  }

  private handleNewOfferFromHistoryState(): void {
    const nuevaOferta = history.state.nuevaOferta;
    if (nuevaOferta && nuevaOferta.offerId) {
      const yaExiste = this.cursos.some(c => c.offerId === nuevaOferta.offerId);
      if (!yaExiste) {
        this.cursos.push(nuevaOferta);
        // Important: Update the shared service state and trigger change detection
        this.editPathService.setRuta(this.rutaId, this.cursos);
        this.cursos = [...this.cursos]; // Create a new array reference to force Angular change detection
      }
      // Clear the history.state to prevent re-adding the same offer on subsequent navigation
      history.replaceState({}, document.title, location.href);
    }
  }

  eliminarCurso_2(index: number): void {
    this.cursos.splice(index, 1);
  this.editPathService.setRuta(this.rutaId, this.cursos); // 👈 ¡clave!
this.cursos = [...this.cursos]; // fuerza refresco visual

  }
    eliminarCurso(index: number): void {
    // Basic validation
    if (index < 0 || index >= this.cursos.length) {
        console.warn('Attempted to delete a course at an invalid index.');
        return;
    }
    this.cursos.splice(index, 1);
    this.editPathService.setRuta(this.rutaId, this.cursos); // Update shared state
    this.cursos = [...this.cursos]; // Force visual refresh
  }

  cancelar(): void {
    this.router.navigate(['/analista/rutas']);
    this.editPathService.clear();
this.router.navigate(['/analista/rutas']);
  }

  /*
guardar(): void {
  const addedOffers = this.cursos.filter(
    curso => !this.originalOffers.some(orig => orig.offerId === curso.offerId)
  );

  const removedOffers = this.originalOffers.filter(
    orig => !this.cursos.some(curso => curso.offerId === orig.offerId)
  );

  const addRequests = addedOffers.map(curso =>
    this.rutasService.addOfferToPath(this.rutaId, curso.offerId)
  );

  const deleteRequests = removedOffers.map(curso =>
    this.rutasService.removeOfferFromPath(this.rutaId, curso.offerId)
  );

  // Ejecutamos todas las peticiones
  Promise.all([...addRequests, ...deleteRequests])
    .then(() => {
      alert('Ruta actualizada correctamente.');
      this.router.navigate(['/analista/rutas']);
    })
    .catch(err => {
      console.error('Error al actualizar la ruta:', err);
      alert('Ocurrió un error al actualizar la ruta.');
    });
    this.editPathService.clear();
this.router.navigate(['/analista/rutas']);
}
*/

/*
guardar(): void {
  const addedOffers = this.cursos.filter(
    curso => !this.originalOffers.some(orig => orig.offerId === curso.offerId)
  );

  const removedOffers = this.originalOffers.filter(
    orig => !this.cursos.some(curso => curso.offerId === orig.offerId)
  );

  const addRequests = addedOffers.map(curso =>
    this.rutasService.addOfferToPath(this.rutaId, curso.offerId)
  );

  const deleteRequests = removedOffers.map(curso =>
    this.rutasService.removeOfferFromPath(this.rutaId, curso.offerId)
  );

  const allRequests = [...addRequests, ...deleteRequests];

  if (allRequests.length === 0) {
    alert('No hay cambios para guardar.');
    return;
  }

  forkJoin(allRequests).subscribe({
    next: () => {
      alert('Ruta actualizada correctamente.');
      this.editPathService.clear();  // Limpia caché temporal
      this.router.navigate(['/analista/rutas']);
    },
    error: (err) => {
      console.error('Error al actualizar la ruta:', err);
      alert('Ocurrió un error al actualizar la ruta.');
    }
  });
}*/

guardar_casifunciona(): void {
  const addedOffers = this.cursos.filter(
    curso => !this.originalOffers.some(orig => orig.offerId === curso.offerId)
  );

  const removedOffers = this.originalOffers.filter(
    orig => !this.cursos.some(curso => curso.offerId === orig.offerId)
  );

  const addRequests = addedOffers.map(curso =>
    this.rutasService.addOfferToPath(this.rutaId, curso.offerId)
  );

  const deleteRequests = removedOffers.map(curso =>
    this.rutasService.removeOfferFromPath(this.rutaId, curso.offerId)
  );

  const allRequests = [...addRequests, ...deleteRequests];

  if (allRequests.length === 0) {
    alert('No hay cambios por guardar.');
    return;
  }

  forkJoin(allRequests).subscribe({
    next: () => {
      alert('Ruta actualizada correctamente.');
      this.editPathService.clear(); // ✅ Limpia solo si todo fue bien
      this.router.navigate(['/analista/rutas']);
    },
    error: (err) => {
      console.error('Error al actualizar la ruta:', err);
      alert('Ocurrió un error al actualizar la ruta.');
    }
  });
}

 guardar_add_all(): void {
    const addedOffers = this.cursos.filter(
      curso => curso.offerId && !this.originalOffers.some(orig => orig.offerId === curso.offerId)
    );

    const removedOffers = this.originalOffers.filter(
      orig => orig.offerId && !this.cursos.some(curso => curso.offerId === orig.offerId)
    );

    if (addedOffers.length === 0 && removedOffers.length === 0) {
      alert('No hay cambios por guardar.');
      return;
    }

    const addRequests = addedOffers
      .filter(curso => !!curso.offerId)
      .map(curso => this.rutasService.addOfferToPath(this.rutaId, curso.offerId));

    const deleteRequests = removedOffers
      .filter(curso => !!curso.offerId)
      .map(curso => this.rutasService.removeOfferFromPath(this.rutaId, curso.offerId));

    forkJoin([...addRequests, ...deleteRequests]).subscribe({
      next: () => {
        alert('Ruta actualizada correctamente.');
        this.editPathService.clear();
        this.router.navigate(['/analista/rutas']);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error?.includes('could not execute statement')) {
          alert('No se pudo agregar una oferta porque ya existe en la ruta.');
        } else {
          alert('Ocurrió un error al actualizar la ruta.');
        }
        console.error('Error al actualizar la ruta:', err);
      }
    });
  }
guardar_eliminavarios_nobien(): void {
    const currentOfferIds = this.cursos.map(c => c.offerId);
    const originalOfferIds = this.originalOffers.map(c => c.offerId);

    const addedOffers = this.cursos.filter(c => !originalOfferIds.includes(c.offerId));
    const removedOffers = this.originalOffers.filter(c => !currentOfferIds.includes(c.offerId));

    if (addedOffers.length === 0 && removedOffers.length === 0) {
      alert('No hay cambios por guardar.');
      return;
    }

    const addRequests = addedOffers.map(c =>
      this.rutasService.addOfferToPath(this.rutaId, c.offerId)
    );

    const deleteRequests = removedOffers.map(c =>
      this.rutasService.removeOfferFromPath(this.rutaId, c.offerId)
    );

    forkJoin([...addRequests, ...deleteRequests]).subscribe({
      next: () => {
        alert('Ruta actualizada correctamente.');
        this.editPathService.clear();
        this.router.navigate(['/analista/rutas']);
      },
      error: (err) => {
        if (err.status === 400 && err.error?.error?.includes('could not execute statement')) {
          alert('No se pudo actualizar la ruta: posible oferta duplicada o inexistente.');
        } else {
          alert('Ocurrió un error al actualizar la ruta.');
        }
        console.error('Error al actualizar la ruta:', err);
      }
    });
  }

guardar_no(): void {
  const addedOffers = this.cursos.filter(
    curso => !this.originalOffers.some(orig => orig.offerId === curso.offerId)
  );

  const removedOffers = this.originalOffers.filter(
    orig => !this.cursos.some(curso => curso.offerId === orig.offerId)
  );

  const addRequests = addedOffers.map(curso =>
    this.rutasService.addOfferToPath(this.rutaId, curso.offerId)
  );

  const deleteRequests = removedOffers.map(curso =>
    this.rutasService.removeOfferFromPath(this.rutaId, curso.offerId)
  );

  Promise.all([...addRequests, ...deleteRequests])
    .then(() => {
      alert('Ruta actualizada correctamente.');
      this.router.navigate(['/analista/rutas']);
    })
    .catch(err => {
      console.error('Error al actualizar la ruta:', err);
      alert('Ocurrió un error al actualizar la ruta.');
    });
}

guardar(): void {
    const original = this.editPathService.getOriginalOffers(); // Get the original state from the service
    // Ensure original is not empty or undefined before proceeding
    if (!original || original.length === 0) {
        // If original state is somehow lost, reload from backend or prevent saving
        alert('El estado original de la ruta no está disponible. Recargando la ruta.');
        this.loadPathFromBackend(); // Attempt to re-load original state
        return;
    }

    const currentOfferIds = new Set(this.cursos.map(c => c.offerId));
    const originalOfferIds = new Set(original.map(c => c.offerId));

    // Calculate added and removed offers based on offerId
    const addedOffers = this.cursos.filter(c => c.offerId && !originalOfferIds.has(c.offerId));
    const removedOffers = original.filter(c => c.offerId && !currentOfferIds.has(c.offerId));

    if (addedOffers.length === 0 && removedOffers.length === 0) {
      alert('No hay cambios por guardar.');
      return;
    }

    // Map each change to an observable HTTP request, adding error handling per request
    const addRequests = addedOffers.map(c =>
      this.rutasService.addOfferToPath(this.rutaId, c.offerId).pipe(
        catchError(err => {
          console.error(`Error al añadir la oferta ${c.offerId}:`, err);
          // Re-throw the error to ensure forkJoin's error block is triggered
          // This ensures that if any single add/delete fails, the whole save operation fails
          throw err;
        })
      )
    );

    const deleteRequests = removedOffers.map(c =>
      this.rutasService.removeOfferFromPath(this.rutaId, c.offerId).pipe(
        catchError(err => {
          console.error(`Error al eliminar la oferta ${c.offerId}:`, err);
          throw err;
        })
      )
    );

    // Use forkJoin to execute all requests in parallel and wait for all to complete
    forkJoin([...addRequests, ...deleteRequests]).subscribe({
      next: () => {
        alert('Ruta actualizada correctamente.');
        // After a successful save, the 'originalOffers' should now reflect the 'cursos'
        // This is crucial for subsequent edits to calculate changes correctly.
        this.originalOffers = [...this.cursos];
        this.editPathService.setOriginalOffers(this.originalOffers); // Update the service's original state too

        this.editPathService.clear(); // Clear temporary cache as changes are now persisted
        this.router.navigate(['/analista/rutas']);
      },
      error: (err) => {
        console.error('Error al actualizar la ruta:', err);
        // Provide a more user-friendly error message
        let errorMessage = 'Ocurrió un error al actualizar la ruta.';
        if (err.status === 400) {
          if (err.error?.message) {
             errorMessage = `Error del servidor: ${err.error.message}`;
          } else if (err.error?.error?.includes('could not execute statement')) {
            errorMessage = 'No se pudo actualizar la ruta: posible oferta duplicada o inexistente.';
          }
        }
        alert(errorMessage + ' Por favor, revise la consola para más detalles.');
        // Do NOT clear the editPathService cache here, so the user can potentially fix and retry
      }
    });
  }

  addCurso(): void {
      this.editPathService.setRuta(this.rutaId, this.cursos); // 👈 guarda estado antes de ir

  this.router.navigate(['add'], { relativeTo: this.route });
  }

}
