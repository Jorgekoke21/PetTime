import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../reservas.service';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva-list.component.html'
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

  cambiarEstado(reserva: any, nuevoEstado: string) {
    this.reservasService.cambiarEstado(reserva.id, nuevoEstado).subscribe({
      next: () => {
        alert('Estado actualizado correctamente');
        this.cargarReservas();
      },
      error: (err) => alert(err?.error?.error || err?.error || 'Error al actualizar el estado')
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
