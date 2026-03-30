import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold text-primary-custom" routerLink="/">
          <i class="fas fa-dog me-2"></i>PetTime
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/paseadores" routerLinkActive="active">Paseadores</a>
            </li>
            
            @if (!authService.currentUserSig()) {
              <li class="nav-item ms-2">
                <a class="btn btn-outline-primary btn-sm px-4" routerLink="/login">Ingresar</a>
              </li>
              <li class="nav-item ms-2">
                <a class="btn btn-primary btn-sm px-4" routerLink="/register">Registro</a>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" routerLink="/reservas">Mis Reservas</a>
              </li>
              @if (esPaseador) {
                <li class="nav-item">
                  <a class="nav-link" routerLink="/mi-perfil">Mi Perfil</a>
                </li>
              }
              <li class="nav-item ms-3">
                <span class="fw-bold me-2">{{ authService.currentUserSig().username }}</span>
                <button class="btn btn-sm btn-outline-danger" (click)="logout()">Salir</button>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);

  get esPaseador(): boolean {
    const user = this.authService.currentUserSig();
    return Array.isArray(user?.roles) && user.roles.includes('PASEADOR');
  }

  logout() {
    this.authService.logout();
  }
}
