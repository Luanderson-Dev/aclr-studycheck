import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-8">
              <span class="text-xl font-bold text-gray-800">StudyCheck</span>
              <a
                routerLink="/"
                routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-gray-600 hover:text-gray-800 h-16 flex items-center px-1 text-sm font-medium"
              >Minhas Sessões</a>
              <a
                routerLink="/leaderboard"
                routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                class="text-gray-600 hover:text-gray-800 h-16 flex items-center px-1 text-sm font-medium"
              >Leaderboard</a>
              @if (auth.eAdmin()) {
                <a
                  routerLink="/sessions"
                  routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                  class="text-gray-600 hover:text-gray-800 h-16 flex items-center px-1 text-sm font-medium"
                >Registros</a>
                <a
                  routerLink="/usuarios"
                  routerLinkActive="text-blue-600 border-b-2 border-blue-600"
                  class="text-gray-600 hover:text-gray-800 h-16 flex items-center px-1 text-sm font-medium"
                >Usuários</a>
              }
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                {{ auth.usuarioLogado()?.nome }}
                <span class="ml-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                  {{ auth.usuarioLogado()?.role }}
                </span>
              </span>
              <button
                (click)="auth.logout()"
                class="text-sm text-red-600 hover:text-red-800 font-medium"
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
