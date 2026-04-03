import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
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

      const signupRequest = {
        nombre: nombre,
        email: email,
        password: password,
        rol: isPaseador ? ['paseador'] : []
      };

      this.authService.register(signupRequest).subscribe({
        next: () => {
          this.isSuccessful = true;
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || err?.error?.error || 'Error en el registro';
        }
      });
    }
  }
}
