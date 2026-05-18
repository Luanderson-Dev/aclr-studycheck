import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-discord-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: [`
    :host { display: block; }
    .scene {
      min-height: 100vh;
      background:
        radial-gradient(circle at 84% 88%, var(--app-accent-soft), transparent 24%),
        var(--app-bg);
    }
    .spinner {
      border: 3px solid var(--app-accent-soft);
      border-top-color: var(--app-accent);
    }
  `],
  template: `
    <div class="scene flex items-center justify-center px-4">
      <div class="w-full max-w-md rounded-2xl border border-app bg-surface p-8 text-center backdrop-blur">
        @if (erro()) {
          <div class="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">{{ erro() }}</div>
          <a routerLink="/login" class="font-mono text-sm text-accent transition-colors hover:text-accent">← Voltar ao login</a>
        } @else {
          <div class="flex flex-col items-center gap-4">
            <div class="spinner h-8 w-8 animate-spin rounded-full"></div>
            <p class="font-mono text-sm text-muted">Autenticando com Discord...</p>
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
