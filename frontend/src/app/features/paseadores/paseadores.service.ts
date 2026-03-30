import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaseadoresService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/paseadores';

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMiPerfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updatePerfil(datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, datos);
  }
}
