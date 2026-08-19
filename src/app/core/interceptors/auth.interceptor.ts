import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ModalService } from '../../core/services/modal.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const modalService = inject(ModalService);
  const token = localStorage.getItem('token');
  const router = inject(Router);

  // 2. Clone the request to add the header (Your existing logic)
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // 3. Handle the request AND catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if the error is 401 (Unauthorized) or 403 (Forbidden)
      if (error.status === 401 || error.status === 403) {
        const message = error.error ?? 'You are not authorized to perform this action.';

        // Clear the invalid token
        // localStorage.removeItem('token');

        // Redirect to login page
        // router.navigate(['/access-denied']);

        modalService.openInfo(message);
      }

      // Re-throw the error so your components can still handle other specific errors if needed
      return throwError(() => error);
    }),
  );
};
