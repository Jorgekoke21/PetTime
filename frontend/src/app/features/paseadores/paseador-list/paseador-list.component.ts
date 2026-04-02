import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaseadoresService } from '../paseadores.service';
import { ReservasService } from '../../reservas/reservas.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-paseador-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    #modal-map {
      height: 320px;
      width: 100%;
      border-radius: 24px;
    }
  `],
  template: `
    <div class="container py-4 py-lg-5">
      <div class="listing-hero card border-0 p-4 p-lg-5 mb-4 listing-surface">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <span class="hero-badge mb-3 d-inline-flex align-items-center gap-2">
              <i class="fas fa-paw"></i>
              Paseadores disponibles
            </span>
            <h2 class="text-primary-custom mb-2">Perfiles mejor presentados y mucho más visuales</h2>
            <p class="text-muted mb-0">Ahora el listado se siente más editorial: más aire, mejor jerarquía y más diferencia entre bloques.</p>
          </div>
          <div class="col-lg-4">
            <div class="stats-inline d-flex gap-3 justify-content-lg-end">
              <div class="mini-stat glass-pill">
                <strong>{{ paseadores().length }}</strong>
                <span>Paseadores</span>
              </div>
              <div class="mini-stat glass-pill">
                <strong>Top</strong>
                <span>Selección visible</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="editorial-list d-flex flex-column gap-4">
        @for (paseador of paseadores(); track paseador.id; let i = $index) {
          <article class="card border-0 editorial-card p-4 p-lg-5">
            <div class="row align-items-center g-4">
              <div class="col-lg-3">
                <div class="editorial-side h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div class="editorial-avatar premium-avatar ring-avatar mb-3">
                      <i class="fas fa-user"></i>
                    </div>
                    <span class="editorial-rank">Perfil {{ i + 1 }}</span>
                    <h4 class="mt-3 mb-1">{{ paseador.nombre }}</h4>
                    <small class="text-muted">Paseador profesional</small>
                  </div>
                  <div class="mt-4">
                    <span class="rating-pill">⭐ {{ paseador.calificacion || 5.0 }}</span>
                  </div>
                </div>
              </div>

              <div class="col-lg-5">
                <div class="editorial-content">
                  <h5 class="mb-3">Sobre este perfil</h5>
                  <p class="text-muted editorial-bio mb-4">
                    {{ paseador.biografia || 'Paseador disponible para ayudarte con tu mascota y ofrecer un paseo de calidad.' }}
                  </p>

                  <div class="editorial-tags d-flex flex-wrap gap-2">
                    <span class="tech-pill">Reserva rápida</span>
                    <span class="tech-pill">Ubicación visible</span>
                    <span class="tech-pill">Perfil activo</span>
                  </div>
                </div>
              </div>

              <div class="col-lg-4">
                <div class="editorial-panel highlighted-box h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div class="detail-grid mb-3">
                      <div class="detail-item soft-panel">
                        <span>Precio</span>
                        <strong>{{ paseador.precioPorHora }} € / h</strong>
                      </div>
                      <div class="detail-item soft-panel">
                        <span>Valoración</span>
                        <strong>{{ paseador.calificacion || 5.0 }}/5</strong>
                      </div>
                    </div>

                    <div class="d-grid gap-2 mb-3">
                      @if (paseador.latitud != null && paseador.longitud != null) {
                        <button class="btn btn-soft btn-sm"
                          data-bs-toggle="modal" data-bs-target="#mapModal"
                          (click)="seleccionarPaseador(paseador)">
                          Ver ubicación
                        </button>
                      }
                    </div>
                  </div>

                  <div class="booking-box premium-booking mt-2">
                    <label class="small fw-bold mb-2 d-block">Reservar para</label>
                    <input type="datetime-local" class="form-control mb-3" [(ngModel)]="fechas[paseador.id]">
                    <button class="btn btn-primary w-100"
                      (click)="reservar(paseador.id)"
                      [disabled]="!fechas[paseador.id]">
                      Reservar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        } @empty {
          <div class="card p-5 text-center empty-state-card">
            <div class="empty-illustration mx-auto mb-3">
              <i class="fas fa-paw"></i>
            </div>
            <h4 class="mb-2">No hay paseadores disponibles</h4>
            <p class="mb-0 text-muted">Prueba más tarde o revisa si el backend tiene datos cargados.</p>
          </div>
        }
      </div>
    </div>

    <div class="modal fade" id="mapModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 premium-modal">
          <div class="modal-header border-0 pb-0">
            <div>
              <h5 class="modal-title mb-1">Ubicación del paseador</h5>
              <small class="text-muted">{{ selectedPaseador?.nombre }}</small>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-3">
            <div id="modal-map"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PaseadorListComponent implements OnInit, AfterViewInit {
  paseadoresService = inject(PaseadoresService);
  reservasService = inject(ReservasService);
  router = inject(Router);

  paseadores = signal<any[]>([]);
  fechas: { [key: number]: string } = {};
  private modalMap?: L.Map;
  private modalMarker?: L.Marker;
  selectedPaseador: any = null;
  private customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/91/91544.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  ngOnInit() {
    this.paseadoresService.getAll().subscribe(data => {
      this.paseadores.set(data);
    });
  }

  ngAfterViewInit() {
    this.configurarModalMap();
  }

  seleccionarPaseador(paseador: any) {
    this.selectedPaseador = paseador;
  }

  reservar(paseadorId: number) {
    const fecha = this.fechas[paseadorId];
    if (!fecha) return;

    this.reservasService.crearReserva(paseadorId, fecha).subscribe({
      next: () => {
        alert('Reserva creada correctamente');
        this.router.navigate(['/reservas']);
      },
      error: (err) => alert(err?.error?.error || err?.error || 'Error al reservar')
    });
  }

  private configurarModalMap() {
    const modalEl = document.getElementById('mapModal');
    if (!modalEl) return;

    modalEl.addEventListener('shown.bs.modal', () => {
      setTimeout(() => {
        this.inicializarMapaModal();
      }, 0);
    });
  }

  private inicializarMapaModal() {
    if (!this.selectedPaseador) return;

    const lat = Number(this.selectedPaseador.latitud);
    const lng = Number(this.selectedPaseador.longitud);

    if (!this.modalMap) {
      this.modalMap = L.map('modal-map').setView([lat, lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.modalMap);
      this.modalMarker = L.marker([lat, lng], { icon: this.customIcon }).addTo(this.modalMap);
    } else {
      this.modalMap.setView([lat, lng], 14);
      this.modalMarker?.setLatLng([lat, lng]);
    }

    this.modalMap.invalidateSize();
  }
}
