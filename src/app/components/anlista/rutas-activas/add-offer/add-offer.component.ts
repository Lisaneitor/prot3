import { Component, OnInit } from '@angular/core';
import { TrainingOffersService } from '../../../../service/training-offers.service';
import { EditPathService } from '../../../../service/edit-path.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-offer',
  standalone: false,
  templateUrl: './add-offer.component.html',
  styleUrl: './add-offer.component.css'
})
export class AddOfferComponent {

   allOffers: any[] = [];
  filteredOffers: any[] = [];
  selectedOfferId = '';
  selectedOffer: any = null;

  constructor(
    private offerService: TrainingOffersService,
    private editPathService: EditPathService,
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.offerService.getAllOffers().subscribe({
      next: (res) => {
        this.allOffers = res.data;
        this.filteredOffers = res.data;
      },
      error: (err) => console.error('Error al obtener ofertas', err)
    });
  }

  onSearchChange(value: string): void {
    const lower = value.toLowerCase();
    this.filteredOffers = this.allOffers.filter(o =>
      o.offerName.toLowerCase().includes(lower)
    );
  }

  onSelectChange(): void {
    if (this.selectedOfferId) {
      this.offerService.getOfferById(this.selectedOfferId).subscribe({
        next: (res) => this.selectedOffer = res.data,
        error: (err) => console.error('Error al obtener detalles de oferta', err)
      });
    }
  }

  cancelar(): void {
  this.router.navigate(['../'], { relativeTo: this.route });
  }

  aceptar(): void {
  if (!this.selectedOffer) {
    Swal.fire({
                  title: 'Error al añadir oferta formativa',
                  text: 'No puedes añadir una oferta formativa porque aún no has seleccionado una oferta',
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
      confirmButtonColor: '#01C4B3'
                });
    return;
  }

  // Navegar de vuelta con estado
    this.router.navigate(['/analista/rutas/detalle', this.editPathService.getRutaId()], {
      state: { nuevaOferta: this.selectedOffer }
    });
}

}
