import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../reservas.service';
import { AuthService } from '../../../core/auth.service';

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
                        'bg-primary': reserva.estado === 'CONFIRMADA',
                        'bg-success': reserva.estado === 'COMPLETADA',
                        'bg-danger': reserva.estado === 'CANCELADA',
                        'bg-secondary': !['PENDIENTE','CONFIRMADA','COMPLETADA','CANCELADA'].includes(reserva.estado)
                    }">
                    {{ reserva.estado }}
                  </span>
                </td>
                <td>
                  @if (reserva.estado === 'PENDIENTE') {
                    @if (esDueno) {
                      <button class="btn btn-danger btn-sm rounded-pill px-3"
                        (click)="cambiarEstado(reserva, 'CANCELADA')">
                        Cancelar
                      </button>
                    } @else {
                      <button class="btn btn-success btn-sm rounded-pill px-3 me-2"
                        (click)="cambiarEstado(reserva, 'CONFIRMADA')">
                        Confirmar
                      </button>
                      <button class="btn btn-danger btn-sm rounded-pill px-3"
                        (click)="cambiarEstado(reserva, 'CANCELADA')">
                        Rechazar
                      </button>
                    }
                  } @else if (reserva.estado === 'CONFIRMADA') {
                    @if (esPaseador) {
                      <button class="btn btn-primary btn-sm rounded-pill px-3"
                        (click)="cambiarEstado(reserva, 'COMPLETADA')">
                        Completar / Finalizar
                      </button>
                    }
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
  authService = inject(AuthService);
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

  cambiarEstado(reserva: any, nuevoEstado: string) {
    this.reservasService.cambiarEstado(reserva.id, nuevoEstado).subscribe({
      next: () => {
        alert('Estado actualizado');
        this.cargarReservas();
      },
      error: () => alert('Error al actualizar el estado')
    });
  }

  get esPaseador(): boolean {
    const user = this.authService.currentUserSig();
    return Array.isArray(user?.roles) && user.roles.includes('PASEADOR');
  }

  get esDueno(): boolean {
    return !this.esPaseador;
  }
}
