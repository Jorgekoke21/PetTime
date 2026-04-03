import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);

  get esPaseador(): boolean {
    const user = this.authService.currentUserSig();
    return Array.isArray(user?.roles) && user.roles.includes('PASEADOR');
  }

  logout() {
    this.authService.logout();
  }
}

