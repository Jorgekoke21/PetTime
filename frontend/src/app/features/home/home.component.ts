import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section py-5 py-lg-6">
      <div class="container">
        <div class="hero-panel card border-0 p-4 p-lg-5 mb-5 overflow-hidden hero-surface">
          <div class="row align-items-center g-5">
            <div class="col-lg-6 text-center text-lg-start position-relative z-2">
              <span class="hero-badge mb-3 d-inline-flex align-items-center gap-2">
                <i class="fas fa-paw"></i>
                Plataforma web de reservas para mascotas
              </span>
              <h1 class="display-2 fw-bold mb-3">Ahora sí empieza a sentirse como una app de verdad</h1>
              <p class="lead text-muted mb-4 hero-copy">
                Más contraste, más composición, más piezas visuales y una experiencia mucho más estética para explorar paseadores y gestionar reservas.
              </p>
              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-4">
                <a routerLink="/paseadores" class="btn btn-primary btn-lg px-5">Explorar paseadores</a>
                <a routerLink="/register" class="btn btn-soft btn-lg px-5">Crear cuenta</a>
              </div>
              <div class="hero-stats row g-3 mt-1">
                <div class="col-4">
                  <div class="stat-card glass-pill">
                    <strong>Look</strong>
                    <span>Más premium</span>
                  </div>
                </div>
                <div class="col-4">
                  <div class="stat-card glass-pill">
                    <strong>Cards</strong>
                    <span>Más suaves</span>
                  </div>
                </div>
                <div class="col-4">
                  <div class="stat-card glass-pill">
                    <strong>Flow</strong>
                    <span>Más limpio</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-6 position-relative z-2">
              <div class="hero-showcase card border-0 p-4 p-md-5 shadow-lg showcase-surface">
                <div class="showcase-top mb-4">
                  <span class="showcase-pill active-pill">Vista renovada</span>
                  <span class="showcase-pill muted-pill">UI más cuidada</span>
                </div>

                <div class="mock-phone mock-phone-large mx-auto mb-4">
                  <div class="mock-screen">
                    <div class="mock-topbar">
                      <span></span><span></span><span></span>
                    </div>
                    <div class="mock-hero-card">
                      <small>PetTime</small>
                      <strong>Paseos con mejor experiencia visual</strong>
                    </div>
                    <div class="mock-card mock-card-main">
                      <div class="mock-avatar"><i class="fas fa-dog"></i></div>
                      <div>
                        <strong>Laura Gómez</strong>
                        <small>Paseadora destacada</small>
                      </div>
                    </div>
                    <div class="mock-chip-row">
                      <span class="mock-chip">12 €/h</span>
                      <span class="mock-chip">5.0 ★</span>
                    </div>
                    <div class="mock-card soft-panel">
                      <strong>Reserva confirmada</strong>
                      <small>Hoy · 18:00</small>
                    </div>
                  </div>
                </div>

                <div class="feature-stack d-flex flex-column gap-3">
                  <div class="feature-strip premium-strip soft-elevated">
                    <i class="fas fa-user-check text-success"></i>
                    <div>
                      <strong>Secciones más diferenciadas</strong>
                      <p class="mb-0 text-muted">Cada bloque empieza a tener una identidad más propia dentro de la aplicación.</p>
                    </div>
                  </div>
                  <div class="feature-strip premium-strip soft-elevated">
                    <i class="fas fa-calendar-days text-primary-custom"></i>
                    <div>
                      <strong>Menos aspecto de maqueta básica</strong>
                      <p class="mb-0 text-muted">Más sensación de producto y menos sensación de bootstrap plano.</p>
                    </div>
                  </div>
                  <div class="feature-strip premium-strip soft-elevated">
                    <i class="fas fa-heart-circle-check text-warning"></i>
                    <div>
                      <strong>Más cambios visibles de verdad</strong>
                      <p class="mb-0 text-muted">El antes y el después se notan más en cards, héroes y paneles.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-glow glow-left"></div>
          <div class="hero-glow glow-right"></div>
        </div>

        <div class="visual-band card border-0 p-4 p-lg-5 mb-5">
          <div class="row g-4 align-items-stretch">
            <div class="col-lg-4">
              <div class="visual-band-item h-100">
                <small class="text-muted d-block mb-2">01</small>
                <h4>Explorar</h4>
                <p class="mb-0">Un listado mucho más visual y menos rígido para descubrir perfiles.</p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="visual-band-item h-100">
                <small class="text-muted d-block mb-2">02</small>
                <h4>Reservar</h4>
                <p class="mb-0">Paneles de acción mejor integrados y más fáciles de interpretar.</p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="visual-band-item h-100">
                <small class="text-muted d-block mb-2">03</small>
                <h4>Gestionar</h4>
                <p class="mb-0">Reservas con más presencia visual y menos apariencia de tabla simple.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {}
