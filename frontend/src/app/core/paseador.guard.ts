import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const paseadorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUserSig();

  const esPaseador = Array.isArray(user?.roles) && user.roles.includes('PASEADOR');
  if (esPaseador) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
