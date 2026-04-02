import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8081/api/reservas';

  crearReserva(paseadorId: number, fechaHora: string): Observable<string> {
    return this.http.post(this.apiUrl, { paseadorId, fechaHora }, { responseType: 'text' });
  }

  getMisReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  pagar(reservaId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/pagar`, { reservaId, metodoPago: 'MOCK' }, { responseType: 'text' });
  }

  cambiarEstado(id: number, nuevoEstado: string): Observable<string> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, null, {
      params: { estado: nuevoEstado },
      responseType: 'text'
    });
  }
}
