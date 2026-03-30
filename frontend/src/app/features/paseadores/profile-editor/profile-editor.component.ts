import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaseadoresService } from '../paseadores.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    .map-container {
      height: 300px;
      width: 100%;
      border-radius: 12px;
    }
  `],
  template: `
    <div class="container py-4">
      <h2 class="mb-4 text-primary-custom">Editar Perfil de Paseador</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card p-4">
        <div class="mb-3">
          <label class="form-label">Biografia</label>
          <textarea class="form-control" rows="4" formControlName="biografia"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Precio por Hora</label>
          <input type="number" class="form-control" formControlName="precioPorHora" min="0" step="0.5">
        </div>

        <div class="mb-3">
          <label class="form-label">Ubicacion (click en el mapa)</label>
          <div id="map" class="map-container"></div>
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Guardar</button>
        </div>

        @if (successMessage) {
          <div class="text-success mt-3">{{ successMessage }}</div>
        }
      </form>
    </div>
  `
})
export class ProfileEditorComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private paseadoresService = inject(PaseadoresService);
  private map?: L.Map;
  private marker?: L.Marker;
  private mapReady = false;
  private customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/91/91544.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  successMessage = '';

  form = this.fb.group({
    biografia: ['', [Validators.maxLength(500)]],
    precioPorHora: [null, [Validators.min(0)]],
    latitud: [''],
    longitud: ['']
  });

  ngOnInit() {
    this.paseadoresService.getMiPerfil().subscribe({
      next: (perfil) => {
        this.form.patchValue({
          biografia: perfil?.biografia ?? '',
          precioPorHora: perfil?.precioPorHora ?? null,
          latitud: String(perfil?.latitud || ''),
          longitud: String(perfil?.longitud || '')
        });

        if (this.mapReady) {
          this.centrarMapaDesdeForm();
        }
      },
      error: () => {
        console.error('Error al cargar el perfil');
      }
    });
  }

  ngAfterViewInit() {
    const lat = this.form.get('latitud')?.value ? Number(this.form.get('latitud')?.value) : 40.416775;
    const lng = this.form.get('longitud')?.value ? Number(this.form.get('longitud')?.value) : -3.70379;

    this.map = L.map('map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { icon: this.customIcon }).addTo(this.map);
    this.mapReady = true;

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.marker?.setLatLng([lat, lng]);
      this.form.patchValue({
        latitud: String(lat),
        longitud: String(lng)
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.paseadoresService.updatePerfil(this.form.value).subscribe({
      next: () => {
        this.successMessage = 'Datos actualizados correctamente';
      },
      error: () => {
        this.successMessage = '';
        console.error('Error al actualizar el perfil');
      }
    });
  }

  private centrarMapaDesdeForm() {
    if (!this.map || !this.marker) return;
    const lat = this.form.get('latitud')?.value ? Number(this.form.get('latitud')?.value) : 40.416775;
    const lng = this.form.get('longitud')?.value ? Number(this.form.get('longitud')?.value) : -3.70379;

    this.map.setView([lat, lng], 13);
    this.marker.setLatLng([lat, lng]);
  }
}
