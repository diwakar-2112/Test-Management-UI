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
    canActivate: [authGuard],
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
        path: 'projects/:projectId/test-suites',
        loadComponent: () => import('./features/test-suite-list/test-suite-list').then(m => m.TestSuiteList)
      },
      {
        path: 'projects/:projectId/test-suites/:suiteId/test-cases',
        loadComponent: () => import('./features/test-case-list/test-case-list').then(m => m.TestCaseList)
      },
      {
        path: 'test-runs',
        loadComponent: () => import('./features/test-run-list/test-run-list').then(m => m.TestRunList)
      },
      {
        path: 'test-runs/:runId',
        loadComponent: () => import('./features/test-run-detail/test-run-detail').then(m => m.TestRunDetail)
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
