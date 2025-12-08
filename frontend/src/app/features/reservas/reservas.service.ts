import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reservas';

  crearReserva(paseadorId: number, fechaHora: string): Observable<any> {
    return this.http.post(this.apiUrl, { paseadorId, fechaHora });
  }

  getMisReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  pagar(reservaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pagar`, { reservaId, metodoPago: 'MOCK' });
  }
}
