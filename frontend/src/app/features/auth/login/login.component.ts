import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5 py-lg-6">
      <div class="row justify-content-center align-items-center g-4 g-lg-5">
        <div class="col-lg-5">
          <div class="card p-4 p-md-5 border-0 auth-card auth-card-main">
            <span class="hero-badge mb-3 d-inline-flex align-items-center gap-2 w-fit">
              <i class="fas fa-lock"></i>
              Acceso seguro
            </span>
            <h2 class="mb-2 text-primary-custom">Bienvenido a PetTime</h2>
            <p class="text-muted mb-4">Inicia sesión para acceder a tus reservas, consultar paseadores y continuar con tu actividad.</p>

            @if (errorMessage) {
              <div class="alert alert-danger rounded-4 auth-alert">{{ errorMessage }}</div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label fw-semibold">Email</label>
                <input type="email" class="form-control" formControlName="email" placeholder="tu@email.com">
              </div>

              <div class="mb-4">
                <label class="form-label fw-semibold">Contraseña</label>
                <input type="password" class="form-control" formControlName="password" placeholder="Introduce tu contraseña">
              </div>

              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary btn-lg" [disabled]="loginForm.invalid">Entrar</button>
              </div>
            </form>

            <div class="auth-bottom text-center text-muted mt-3">
              ¿No tienes cuenta?
              <a routerLink="/register" class="fw-bold text-decoration-none">Regístrate aquí</a>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card p-4 p-md-5 border-0 auth-side-card">
            <div class="auth-side-header mb-4">
              <span class="mini-dot"></span>
              <small class="text-muted fw-semibold">Experiencia más clara y profesional</small>
            </div>

            <h4 class="mb-3">¿Qué puedes hacer dentro?</h4>

            <div class="feature-strip premium-strip mb-3">
              <i class="fas fa-search text-primary-custom"></i>
              <div>
                <strong>Explorar perfiles</strong>
                <p class="mb-0 text-muted">Consulta paseadores, precios y ubicación antes de reservar.</p>
              </div>
            </div>

            <div class="feature-strip premium-strip mb-3">
              <i class="fas fa-calendar-check text-success"></i>
              <div>
                <strong>Gestionar reservas</strong>
                <p class="mb-0 text-muted">Revisa el estado de tus paseos y mantén todo organizado.</p>
              </div>
            </div>

            <div class="feature-strip premium-strip">
              <i class="fas fa-shield-heart text-warning"></i>
              <div>
                <strong>Seguridad básica bien planteada</strong>
                <p class="mb-0 text-muted">JWT para autenticación y BCrypt para proteger contraseñas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/paseadores']);
        },
        error: () => {
          this.errorMessage = 'Credenciales inválidas';
        }
      });
    }
  }
}
