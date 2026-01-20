import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { authGuard } from './core/authGuard/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login/login').then(m => m.Login)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // Uncomment when ready to enforce auth
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/project-list/project-list').then(m => m.ProjectList)
      },
      {
        path: 'projects/:projectId',
        loadComponent: () => import('./features/project-screen/project-screen').then(m => m.ProjectScreen)
      },
      {
        path: 'dashboard',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
