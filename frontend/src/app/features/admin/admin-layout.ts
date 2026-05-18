import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeToggle } from '../../core/components/theme-toggle';

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-950">
      <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-col gap-4 min-w-0">
              <div class="flex items-center justify-between gap-3">
                <span class="text-xl font-bold text-gray-800 dark:text-gray-100">StudyCheck</span>
                <div class="flex items-center gap-3 lg:hidden">
                  <app-theme-toggle />
                  <button
                    (click)="auth.logout()"
                    class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                  >Sair</button>
                </div>
              </div>
              <div class="overflow-x-auto pb-1">
                <div class="flex min-w-max items-center gap-5">
                  <a
                    routerLink="/"
                    routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 py-2 px-1 text-sm font-medium whitespace-nowrap"
                  >Minhas Sessões</a>
                  <a
                    routerLink="/leaderboard"
                    routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 py-2 px-1 text-sm font-medium whitespace-nowrap"
                  >Leaderboard</a>
                  @if (auth.eAdmin()) {
                    <a
                      routerLink="/sessions"
                      routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 py-2 px-1 text-sm font-medium whitespace-nowrap"
                    >Registros</a>
                    <a
                      routerLink="/usuarios"
                      routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 py-2 px-1 text-sm font-medium whitespace-nowrap"
                    >Usuários</a>
                  }
                </div>
              </div>
            </div>
            <div class="hidden lg:flex items-center space-x-4">
              <app-theme-toggle />
              <span class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {{ auth.usuarioLogado()?.nome }}
                <span class="ml-1 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full">
                  {{ auth.usuarioLogado()?.role }}
                </span>
              </span>
              <button
                (click)="auth.logout()"
                class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
              >Sair</button>
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayout {
  readonly auth = inject(AuthService);
}
