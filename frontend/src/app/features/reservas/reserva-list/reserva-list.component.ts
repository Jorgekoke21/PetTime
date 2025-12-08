import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../reservas.service';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 text-secondary-custom">Mis Reservas</h2>

      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Fecha/Hora</th>
              <th>Paseador / Cliente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (reserva of reservas(); track reserva.id) {
              <tr>
                <td>#{{ reserva.id }}</td>
                <td>{{ reserva.fechaHoraReserva | date:'short' }}</td>
                <td>
                    <span class="fw-bold">{{ reserva.paseador?.nombre }}</span>
                    <br>
                    <small class="text-muted">\${{ reserva.paseador?.precioPorHora }}</small>
                </td>
                <td>
                  <span class="badge rounded-pill" 
                    [ngClass]="{
                        'bg-warning text-dark': reserva.estado === 'PENDIENTE', 
                        'bg-success': reserva.estado === 'PAGADA',
                        'bg-secondary': reserva.estado === 'FINALIZADA'
                    }">
                    {{ reserva.estado }}
                  </span>
                </td>
                <td>
                  @if (reserva.estado === 'PENDIENTE') {
                    <button class="btn btn-success btn-sm rounded-pill px-3" (click)="pagar(reserva)">
                      <i class="fas fa-credit-card me-1"></i> Pagar
                    </button>
                  } @else if (reserva.estado === 'PAGADA') {
                     <span class="text-success"><i class="fas fa-check"></i> Listo</span>
                  }
                </td>
              </tr>
            } @empty {
                <tr><td colspan="5" class="text-center py-4">No tienes reservas aún.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReservaListComponent implements OnInit {
  reservasService = inject(ReservasService);
  reservas = signal<any[]>([]);

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservasService.getMisReservas().subscribe(data => {
      this.reservas.set(data);
    });
  }

  pagar(reserva: any) {
    if(confirm(`¿Confirmar pago simulado de $${reserva.paseador.precioPorHora}?`)) {
        this.reservasService.pagar(reserva.id).subscribe({
            next: () => {
                alert('Pago realizado con éxito');
                this.cargarReservas();
            },
            error: () => alert('Error en el pago')
        });
    }
  }
}
