import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'preview',
    loadComponent: () =>
      import('./features/preview/preview-layout').then((m) => m.PreviewLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/preview/preview-dashboard').then((m) => m.PreviewDashboard),
      },
      {
        path: 'leaderboard',
        loadComponent: () =>
          import('./features/preview/preview-leaderboard').then((m) => m.PreviewLeaderboard),
      },
    ],
  },
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
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/usuarios/usuarios').then((m) => m.Usuarios),
      },
      {
        path: 'sessions',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/sessions/admin-sessions').then((m) => m.AdminSessions),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
