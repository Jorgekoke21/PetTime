import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-shell">
      <app-navbar></app-navbar>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="site-footer mt-5">
        <div class="container py-5">
          <div class="row g-4 align-items-start">
            <div class="col-md-5">
              <div class="d-flex align-items-center gap-3 mb-3">
                <span class="avatar-bubble" style="width: 48px; height: 48px; font-size: 1.1rem;">
                  <i class="fas fa-dog"></i>
                </span>
                <div>
                  <h5 class="mb-0">PetTime</h5>
                  <small class="text-muted">Proyecto académico de 2º de DAW</small>
                </div>
              </div>
              <p class="mb-0 text-muted">
                Plataforma web para conectar dueños de mascotas con paseadores mediante una arquitectura cliente-servidor con Angular, Spring Boot y MySQL.
              </p>
            </div>

            <div class="col-md-3">
              <h6 class="footer-title">Aplicación</h6>
              <ul class="list-unstyled footer-links mb-0">
                <li><a href="/">Inicio</a></li>
                <li><a href="/paseadores">Paseadores</a></li>
                <li><a href="/reservas">Reservas</a></li>
              </ul>
            </div>

            <div class="col-md-4">
              <h6 class="footer-title">Tecnologías</h6>
              <div class="d-flex flex-wrap gap-2">
                <span class="tech-pill">Angular 17</span>
                <span class="tech-pill">Spring Boot 3</span>
                <span class="tech-pill">MySQL</span>
                <span class="tech-pill">JWT</span>
              </div>
            </div>
          </div>

          <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pt-4 mt-4">
            <small class="text-muted">© 2026 PetTime · Interfaz y MVP funcional para el TFG</small>
            <small class="text-muted">Hecho para demostrar frontend, backend, seguridad y persistencia</small>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {}
