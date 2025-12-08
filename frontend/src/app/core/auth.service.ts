import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUserSig: WritableSignal<any> = signal(null);

  constructor(private http: HttpClient, private router: Router) { 
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSig.set(JSON.parse(user));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + 'signin', credentials).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        this.saveUser(response);
        this.currentUserSig.set(response);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(API_URL + 'signup', user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSig.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  isLoggedIn(): boolean {
      return !!this.getToken();
  }
}
