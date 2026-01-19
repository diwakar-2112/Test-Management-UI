import { Routes } from '@angular/router';
import { ProjectList } from './features/project-list/project-list';
import { Dashboard } from './features/dashboard/dashboard';
import { Login } from './features/auth/login/login/login';
import { ProjectScreen } from './features/project-screen/project-screen';
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
    path: 'project-screen',
    component:ProjectScreen,
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
