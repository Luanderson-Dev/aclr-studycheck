import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'auth/discord/callback',
    loadComponent: () =>
      import('./features/login/discord-callback').then((m) => m.DiscordCallback),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'leaderboard',
        loadComponent: () =>
          import('./features/admin/leaderboard/leaderboard').then((m) => m.Leaderboard),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
