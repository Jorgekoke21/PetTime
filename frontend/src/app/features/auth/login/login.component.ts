import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card p-4 shadow-sm">
          <h3 class="text-center mb-4 text-primary-custom">Iniciar Sesión</h3>
          
          @if (errorMessage) {
            <div class="alert alert-danger">{{ errorMessage }}</div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" formControlName="email" placeholder="tu@email.com">
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" formControlName="password" placeholder="******">
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid">Ingresar</button>
            </div>
          </form>
          <div class="mt-3 text-center">
             <small>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></small>
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
        error: (err) => {
          this.errorMessage = 'Credenciales inválidas';
          console.error(err);
        }
      });
    }
  }
}
