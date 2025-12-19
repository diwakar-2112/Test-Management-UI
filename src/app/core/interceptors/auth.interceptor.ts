import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router); // 1. Inject Router to redirect user
  const token = localStorage.getItem('token');
  
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
        
        // Clear the invalid token
        localStorage.removeItem('token');
        
        // Redirect to login page
        router.navigate(['/login']);
      }

      // Re-throw the error so your components can still handle other specific errors if needed
      return throwError(() => error);
    })
  );
};