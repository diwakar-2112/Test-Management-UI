import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { DialogService } from 'primeng/dynamicdialog';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { globalLoaderInterceptor } from './core/interceptors/global-loader.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none'
        }
      },
      ripple: true,
      zIndex: {
        modal: 1100,    // dialog, sidebar
        overlay: 1000,  // dropdown, overlaypanel
        menu: 1000,     // overlay menus
        tooltip: 1100   // tooltip
      },
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, globalLoaderInterceptor])
    ),
    DialogService,
  ]
};
