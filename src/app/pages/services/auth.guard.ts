import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //  Use isLoggedIn() helper
  if (authService.isLoggedIn()) {
    return true; // user is logged in → allow access
  }

  //  Not logged in → redirect to login
  return router.createUrlTree(['/login']);
};
