import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card p-4">
          <h3 class="text-center mb-4 text-secondary-custom">Crear Cuenta</h3>
          
          @if (isSuccessful) {
            <div class="alert alert-success">Registro exitoso. <a href="/login">Inicia sesión ahora</a>.</div>
          } @else if (errorMessage) {
             <div class="alert alert-danger">{{ errorMessage }}</div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label">Nombre Completo</label>
              <input type="text" class="form-control" formControlName="nombre">
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" formControlName="email">
            </div>
            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" formControlName="password">
            </div>
            
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="checkPaseador" formControlName="isPaseador">
                <label class="form-check-label fw-bold text-primary-custom" for="checkPaseador">¡Quiero ser Paseador!</label>
            </div>
            
            @if (registerForm.get('isPaseador')?.value) {
                <div class="alert alert-info">
                    Como paseador, te asignaremos una tarifa inicial y ubicación por defecto. Podrás editarlo luego.
                </div>
            }

            <div class="d-grid">
              <button type="submit" class="btn btn-secondary btn-block" [disabled]="registerForm.invalid">Registrarse</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  
  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    isPaseador: [false]
  });

  isSuccessful = false;
  errorMessage = '';

  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, email, password, isPaseador } = this.registerForm.value;
      
      // Construcción manual del objeto JSON exacto que espera el Backend
      const signupRequest = {
        nombre: nombre,
        email: email,
        password: password,
        rol: isPaseador ? ["paseador"] : []
      };
      
      this.authService.register(signupRequest).subscribe({
        next: () => {
          this.isSuccessful = true;
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error en el registro';
        }
      });
    }
  }
}