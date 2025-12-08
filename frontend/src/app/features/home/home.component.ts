import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container text-center py-5">
      <div class="row align-items-center">
        <div class="col-md-6 text-md-start">
          <h1 class="display-4 fw-bold text-primary-custom mb-3">Tu mascota merece el mejor paseo</h1>
          <p class="lead text-muted mb-4">Encuentra paseadores de confianza cerca de ti. Agenda y paga de forma segura.</p>
          <a routerLink="/paseadores" class="btn btn-primary btn-lg px-5 me-2">Buscar Paseador</a>
          <a routerLink="/register" class="btn btn-outline-secondary btn-lg px-5">Ser Paseador</a>
        </div>
        <div class="col-md-6 mt-4 mt-md-0">
          <div class="bg-gradient-primary rounded-circle p-5 mx-auto d-flex align-items-center justify-content-center" style="width: 300px; height: 300px;">
            <i class="fas fa-dog text-white" style="font-size: 8rem;"></i>
          </div>
        </div>
      </div>

      <div class="row mt-5 pt-5">
        <div class="col-md-4">
          <div class="card p-4 mb-3 h-100">
            <i class="fas fa-check-circle text-success fa-3x mb-3"></i>
            <h4>Verificados</h4>
            <p>Todos nuestros paseadores pasan por un riguroso control.</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 mb-3 h-100">
            <i class="fas fa-map-marker-alt text-danger fa-3x mb-3"></i>
            <h4>GPS en Vivo</h4>
            <p>Sigue el paseo de tu perro en tiempo real (Próximamente).</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 mb-3 h-100">
            <i class="fas fa-shield-alt text-primary fa-3x mb-3"></i>
            <h4>Pago Seguro</h4>
            <p>Tu dinero está protegido hasta que el paseo finalice.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
