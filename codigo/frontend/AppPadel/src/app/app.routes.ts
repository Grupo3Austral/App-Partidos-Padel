import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage)
  },
  {
    path: 'tabs/home',
    loadComponent: () => import('./tabs/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'tabs/health',
    loadComponent: () => import('./tabs/health/health.page').then(m => m.HealthPage)
  },
  {
    path: 'tabs/capture',
    loadComponent: () => import('./tabs/capture/capture.page').then(m => m.CapturePage)
  },
  {
    path: 'tabs/stats',
    loadComponent: () => import('./tabs/stats/stats.page').then(m => m.StatsPage)
  },
  {
    path: 'tabs/profile',
    loadComponent: () => import('./tabs/profile/profile.page').then(m => m.ProfilePage)
  }
];
