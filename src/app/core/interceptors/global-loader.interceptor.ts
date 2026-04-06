import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { GlobalLoaderService } from '../services/global-loader.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const SKIP_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);

export function withSkipLoader(): HttpContext {
  return new HttpContext().set(SKIP_GLOBAL_LOADER, true);
}

export const globalLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldSkip = req.context.get(SKIP_GLOBAL_LOADER);

  if (shouldSkip) {
    return next(req);
  }

  const loader = inject(GlobalLoaderService);
  const loaderHandle = loader.show();

  return next(req).pipe(finalize(() => loaderHandle.close()));
};
