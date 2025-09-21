import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditPathService {
private rutaId: number | null = null;
  private cursos: any[] = [];           // Estado temporal de cursos editados
  private original: any[] = [];         // Estado original traído del backend

  setRuta_2(id: number, cursos: any[]): void {
    this.rutaId = id;
    this.cursos = [...cursos]; // copia para mantener inmutable el original
  }

  getRutaId(): number | null {
    return this.rutaId;
  }

  getCursos(): any[] {
    return this.cursos;
  }

  addCurso(curso: any): void {
    this.cursos.push(curso);
  }

  removeCurso(index: number): void {
    this.cursos.splice(index, 1);
  }

  reset(): void {
    this.rutaId = null;
    this.cursos = [];
  }
  clear_2(): void {
  this.rutaId = null;
  this.cursos = [];
}

setRuta(id: number, cursos: any[]): void {
  this.rutaId = id;
  this.cursos = [...cursos];
}

setOriginalOffers(offers: any[]): void {
  this.original = [...offers];
}

getOriginalOffers(): any[] {
  return this.original;
}

clear(): void {
  this.rutaId = null;
  this.cursos = [];
  this.original = [];
}


}
