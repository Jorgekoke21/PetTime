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
      height: 300px;
      width: 100%;
      border-radius: 10px;
    }
  `],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 text-primary-custom">Encuentra tu Paseador Ideal</h2>
      
      <div class="row">
        @for (paseador of paseadores(); track paseador.id) {
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <div class="mb-3">
                    <i class="fas fa-user-circle fa-4x text-secondary"></i>
                </div>
                <h5 class="card-title fw-bold">{{ paseador.nombre }}</h5>
                <p class="card-text text-muted">{{ paseador.biografia }}</p>
                <h6 class="text-success fw-bold">\${{ paseador.precioPorHora }} / hora</h6>

                @if (paseador.latitud != null && paseador.longitud != null) {
                  <button class="btn btn-outline-primary btn-sm mt-3"
                    data-bs-toggle="modal" data-bs-target="#mapModal"
                    (click)="seleccionarPaseador(paseador)">
                    Ver ubicacion
                  </button>
                }
                
                <div class="mt-3 text-start bg-light p-3 rounded">
                    <label class="small fw-bold mb-1">Reservar para:</label>
                    <input type="datetime-local" class="form-control form-control-sm mb-2" [(ngModel)]="fechas[paseador.id]">
                    <button class="btn btn-primary btn-sm w-100" 
                        (click)="reservar(paseador.id)"
                        [disabled]="!fechas[paseador.id]">
                        Reservar Ahora
                    </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-12 text-center">
            <p>No hay paseadores disponibles en este momento.</p>
          </div>
        }
      </div>
    </div>

    <div class="modal fade" id="mapModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Ubicacion del paseador</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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
  private selectedPaseador: any = null;
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
        alert('Reserva creada exitosamente');
        this.router.navigate(['/reservas']);
      },
      error: () => alert('Error al reservar')
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
