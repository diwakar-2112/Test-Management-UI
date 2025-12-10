import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

   if (token) {
    // 2. Token exists -> Allow navigation
    return true;
  } else {
    // 3. No token -> Redirect to Login
    // createUrlTree is the modern/cleaner way to redirect inside a guard
    return router.createUrlTree(['/login']);
  }
  return true;
};
