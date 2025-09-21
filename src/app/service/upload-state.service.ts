import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadStateService {
  private hasUploadedCsv$ = new BehaviorSubject<boolean>(this.readPersisted());

  /** observable si lo necesitas en otros comp. */
  readonly uploadedCsv$ = this.hasUploadedCsv$.asObservable();

  /** lectura inmediata */
  get uploadedCsv(): boolean { return this.hasUploadedCsv$.value; }

  /** marcar que el CSV fue aceptado por el backend */
  markUploaded(ok: boolean) {
    this.hasUploadedCsv$.next(ok);
    localStorage.setItem('csv_uploaded', ok ? '1' : '0'); // persistir tras refresh
  }

  /** opcional: limpiar */
  reset() { this.markUploaded(false); }

  private readPersisted(): boolean {
    return localStorage.getItem('csv_uploaded') === '1';
  }
}
