import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
    <footer class="text-center py-4 mt-5 text-muted">
      <small>&copy; 2025 PetTime. Hecho con <i class="fas fa-heart text-danger"></i> para las mascotas.</small>
    </footer>
  `
})
export class AppComponent {
}
