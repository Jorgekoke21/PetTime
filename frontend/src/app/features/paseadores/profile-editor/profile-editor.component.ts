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
      height: 340px;
      width: 100%;
      border-radius: 24px;
      overflow: hidden;
    }
  `],
  template: `
    <div class="container py-4 py-lg-5">
      <div class="row g-4 g-lg-5 align-items-start">
        <div class="col-lg-7">
          <div class="card p-4 p-md-5 border-0 auth-card auth-card-main">
            <span class="hero-badge mb-3 d-inline-flex align-items-center gap-2 w-fit">
              <i class="fas fa-user-pen"></i>
              Perfil de paseador
            </span>
            <h2 class="mb-2 text-primary-custom">Haz tu perfil más atractivo</h2>
            <p class="text-muted mb-4">Cuida tu presentación, define mejor tu precio y ajusta la zona en la que ofreces paseos.</p>

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label fw-semibold">Biografía</label>
                <textarea class="form-control" rows="5" formControlName="biografia" placeholder="Cuéntales a los dueños cómo trabajas, qué experiencia tienes y por qué pueden confiar en ti"></textarea>
                <small class="text-muted">Máximo 500 caracteres.</small>
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Precio por hora (€)</label>
                <input type="number" class="form-control" formControlName="precioPorHora" min="0" step="0.5">
              </div>

              <div class="mb-4 profile-map-card">
                <label class="form-label fw-semibold">Ubicación aproximada</label>
                <div id="map" class="map-container mt-2"></div>
                <small class="text-muted d-block mt-2">Haz clic sobre el mapa para actualizar tu ubicación.</small>
              </div>

              <div class="d-grid">
                <button class="btn btn-primary btn-lg" type="submit" [disabled]="form.invalid">Guardar cambios</button>
              </div>

              @if (successMessage) {
                <div class="alert alert-success rounded-4 auth-alert mt-4 mb-0">{{ successMessage }}</div>
              }

              @if (errorMessage) {
                <div class="alert alert-danger rounded-4 auth-alert mt-4 mb-0">{{ errorMessage }}</div>
              }
            </form>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card p-4 p-md-5 border-0 auth-side-card">
            <div class="auth-side-header mb-4">
              <span class="mini-dot"></span>
              <small class="text-muted fw-semibold">Consejos para destacar</small>
            </div>

            <div class="feature-strip premium-strip mb-3">
              <i class="fas fa-circle-info text-primary-custom"></i>
              <div>
                <strong>Biografía clara y cercana</strong>
                <p class="mb-0 text-muted">Explica tu experiencia, el tipo de mascotas con las que trabajas y tu estilo de paseo.</p>
              </div>
            </div>

            <div class="feature-strip premium-strip mb-3">
              <i class="fas fa-euro-sign text-success"></i>
              <div>
                <strong>Precio coherente</strong>
                <p class="mb-0 text-muted">Un precio bien planteado transmite mejor el valor del servicio.</p>
              </div>
            </div>

            <div class="feature-strip premium-strip">
              <i class="fas fa-map-location-dot text-warning"></i>
              <div>
                <strong>Ubicación orientativa</strong>
                <p class="mb-0 text-muted">No hace falta indicar una dirección exacta; basta una zona aproximada.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  errorMessage = '';

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
        this.errorMessage = 'No se pudo cargar el perfil';
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
        this.successMessage = 'Perfil actualizado correctamente';
        this.errorMessage = '';
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err?.error?.error || 'Error al actualizar el perfil';
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
