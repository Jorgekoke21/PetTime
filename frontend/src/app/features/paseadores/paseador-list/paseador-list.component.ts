import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaseadoresService } from '../paseadores.service';
import { ReservasService } from '../../reservas/reservas.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paseador-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 text-primary-custom">Encuentra tu Paseador Ideal</h2>
      
      <div class="row">
        @for (paseador of paseadores(); track paseador.id) {
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="mb-3">
                    <i class="fas fa-user-circle fa-4x text-secondary"></i>
                </div>
                <h5 class="card-title fw-bold">{{ paseador.nombre }}</h5>
                <p class="card-text text-muted">{{ paseador.biografia }}</p>
                <h6 class="text-success fw-bold">\${{ paseador.precioPorHora }} / hora</h6>
                
                <div class="mt-3 text-start bg-light p-3 rounded">
                    <label class="small fw-bold mb-1">Reservar para:</label>
                    <input type="datetime-local" class="form-control form-control-sm mb-2" [(ngModel)]="fechas[paseador.id]">
                    <button class="btn btn-primary btn-sm w-100" 
                        (click)="reservar(paseador.id)"
                        [disabled]="!fechas[paseador.id]">
                        Reservar Ahora
                    </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center">
            <p>No hay paseadores disponibles en este momento.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class PaseadorListComponent implements OnInit {
  paseadoresService = inject(PaseadoresService);
  reservasService = inject(ReservasService);
  router = inject(Router);
  
  paseadores = signal<any[]>([]);
  fechas: {[key: number]: string} = {};

  ngOnInit() {
    this.paseadoresService.getAll().subscribe(data => {
      this.paseadores.set(data);
    });
  }

  reservar(paseadorId: number) {
    const fecha = this.fechas[paseadorId];
    if (!fecha) return;

    this.reservasService.crearReserva(paseadorId, fecha).subscribe({
      next: () => {
        alert('¡Reserva creada exitosamente!');
        this.router.navigate(['/reservas']);
      },
      error: (err) => alert('Error al reservar')
    });
  }
}
