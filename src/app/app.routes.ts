import { Routes } from '@angular/router';
import { ProjectList } from './features/projects/project-list/project-list';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/auth/login/login/login';
import { authGuard } from './core/authGuard/auth-guard';
export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path:'dashboard',
    component:Dashboard,
    // canActivate:[authGuard]
  },
  {
    path:'projects',
    component:ProjectList,
    // canActivate:[authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
