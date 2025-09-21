import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RutasService } from '../../../service/rutas.service';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-rutas-activas',
  standalone: false,
  templateUrl: './rutas-activas.component.html',
  styleUrl: './rutas-activas.component.css'
})
export class RutasActivasComponent {
  rutas: any[] = [];
  filteredRutas: any[] = [];
  searchTerm = '';
  pageSizes = [5, 10, 15, 20];
selectedPageSize = 5;

  constructor(private rutasService: RutasService,private router: Router, private http: HttpClient) {}
/*
  columns = [
  { name: 'Correo', prop: 'email' },
  { name: 'Adjunta/Gerencia', prop: 'department' },
  { name: 'Rol', prop: 'role' },
  { name: 'Ruta', prop: 'routeName' },
  { name: 'Horas', prop: 'hours' },
  { name: 'Estado', prop: 'status' },
  { name: 'Fecha', prop: 'endDate' }
];


  ngOnInit(): void {
  this.rutasService.getRutas().subscribe((data) => {
    this.rutas = data;
    this.filteredRutas = data;
  });
}
  */

@ViewChild('courseTemplate', { static: true }) courseTemplate!: TemplateRef<any>;
@ViewChild('accionesTemplate', { static: true }) accionesTemplate!: TemplateRef<any>;

columns = [
  { name: 'ID', prop: 'id', width: 60 },
  { name: 'Colaborador ID', prop: 'collaboratorId', width: 180 },
  {
    name: 'Cursos recomendados',
    prop: 'courseNames',
    width: 600,
    cellTemplate: this.courseTemplate
  },
  { name: 'Total horas', prop: 'totalHours', width: 120 },
  { name: 'Fecha', prop: 'createdDate', width: 180 },
  { 
    name: 'Acciones', 
    width: 150, 
    cellTemplate: this.accionesTemplate 
  }
];

/*
  cargarRutas(): void {
    this.rutasService.getRutas().subscribe((data) => {
      this.rutas = data;
    });
  }

  eliminarRuta(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta ruta?')) {
      this.rutasService.deleteRuta(id).subscribe(() => {
        this.rutas = this.rutas.filter(r => r.id !== id);
      });
    }
  }

  filtrarRutas(): Ruta[] {
    const term = this.searchTerm.toLowerCase();
    return this.rutas.filter(r =>
      r.email.toLowerCase().includes(term) ||
      r.department.toLowerCase().includes(term) ||
      r.role.toLowerCase().includes(term) ||
      r.routeName.toLowerCase().includes(term)
    );
  }

  descargarRutas(): void {
  alert('Descargar CSV — funcionalidad aún por implementar');
}
*/
ngOnInit(): void {
  this.columns[2].cellTemplate = this.courseTemplate;

  this.rutasService.getRecommendedPaths().subscribe({
    next: (response) => {
      const rawData = response.data;  // Accedemos a data del response

      this.rutas = rawData.map((ruta: any) => {
        const courseNamesRaw = ruta.trainingOffers.map((t: any) => t.offerName).join('<br>');
        const courseNamesFormatted = courseNamesRaw.replace(/\n/g, '<br>');

        return {
          ...ruta,
          courseNames: courseNamesFormatted,
          totalHours: ruta.trainingOffers.reduce((sum: number, t: any) => sum + t.durationHours, 0)
        };
      });

      this.filteredRutas = [...this.rutas];
    },
    error: (err) => {
      console.error('Error al cargar rutas recomendadas:', err);
    }
  });
}

  filtrarRutas(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRutas = this.rutas.filter(r =>
      r.collaboratorId.toString().includes(term) ||
      r.courseNames.toLowerCase().includes(term)
    );
  }

descargarRutas(): void {
  this.rutasService.exportRecommendedPathsCsv().subscribe({
    next: (blob) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'rutas_recomendadas.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Error al descargar CSV:', err);
      alert('Hubo un problema al descargar el archivo.');
    }
  });
}

eliminarRuta(id: number): void {
  if (confirm('¿Estás seguro de eliminar esta ruta?')) {
    this.rutasService.deleteRuta(id).subscribe({
      next: () => {
        this.rutas = this.rutas.filter(r => r.id !== id);
        this.filteredRutas = [...this.rutas];
      },
      error: (err) => {
        console.error('Error al eliminar ruta:', err);
      }
    });
  }
}

verRuta(id: number): void {
  this.router.navigate(['/analista/rutas/detalle/', id]); // Asegúrate de tener una ruta definida como /analista/rutas/:id
}

formatFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  fecha.setHours(fecha.getHours() - 5); // 👈 resta las 5 horas

  return fecha.toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
}
