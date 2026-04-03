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
  styleUrl: './paseador-list.component.scss',
  templateUrl: './paseador-list.component.html'
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
