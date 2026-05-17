import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-discord-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-gray-100 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 px-4">
      <div class="bg-white/90 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        @if (erro()) {
          <div class="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">{{ erro() }}</div>
          <a routerLink="/login" class="text-blue-600 dark:text-blue-400 hover:underline">Voltar ao login</a>
        } @else {
          <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-gray-600 dark:text-gray-300">Autenticando com Discord...</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class DiscordCallback implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly erro = signal('');

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    if (!code) {
      this.erro.set('Código de autorização não encontrado.');
      return;
    }
    this.auth.loginComDiscord(code).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        if (err.status === 403) this.erro.set('Você não é membro do servidor autorizado.');
        else this.erro.set('Erro ao autenticar com Discord.');
      },
    });
  }
}
