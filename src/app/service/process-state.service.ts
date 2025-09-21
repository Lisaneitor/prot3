import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProcessStateService {
  private processing$ = new BehaviorSubject<boolean>(false);

  get isProcessing$() {
    return this.processing$.asObservable();
  }

  setProcessing(state: boolean) {
    this.processing$.next(state);
  }

  get current(): boolean {
    return this.processing$.value;
  }
}