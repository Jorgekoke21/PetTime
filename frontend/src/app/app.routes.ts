import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'paseadores', 
    loadComponent: () => import('./features/paseadores/paseador-list/paseador-list.component').then(m => m.PaseadorListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'reservas', 
    loadComponent: () => import('./features/reservas/reserva-list/reserva-list.component').then(m => m.ReservaListComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
