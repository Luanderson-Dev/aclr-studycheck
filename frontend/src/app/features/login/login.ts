import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeToggle } from '../../core/components/theme-toggle';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggle],
  template: `
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-gray-100 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4">
      <div class="absolute top-4 right-4 z-10">
        <app-theme-toggle />
      </div>

      <!-- Brilhos de fundo -->
      <div class="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl"></div>

      <div class="relative w-full max-w-md">
        <div class="bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl">
          <div class="flex flex-col items-center mb-8">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.42a12 12 0 0 1 .84 4.42c0 1.42-.34 2.76-.94 3.94" />
                <path d="M12 14v7M5.5 11.5v4.5c0 1.1 2.9 3 6.5 3s6.5-1.9 6.5-3v-4.5" />
              </svg>
            </div>
            <h1 class="text-3xl font-extrabold text-gray-800 dark:text-gray-50 tracking-tight">StudyCheck</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
              Registre suas sessões de estudo e suba no leaderboard.
            </p>
          </div>

          @if (erro()) {
            <div class="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              {{ erro() }}
            </div>
          }

          <button
            type="button"
            (click)="entrarComDiscord()"
            [disabled]="carregando()"
            class="w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#4752C4] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <svg width="22" height="17" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            @if (carregando()) { Entrando... } @else { Entrar com Discord }
          </button>

          <p class="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
            Acesso restrito a membros do servidor autorizado.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class Login {
  private readonly http = inject(HttpClient);
  readonly erro = signal('');
  readonly carregando = signal(false);

  entrarComDiscord(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.http.get<{ url: string }>('/auth/discord/url').subscribe({
      next: (res) => (window.location.href = res.url),
      error: () => {
        this.carregando.set(false);
        this.erro.set('Erro ao iniciar autenticação com Discord.');
      },
    });
  }
}
