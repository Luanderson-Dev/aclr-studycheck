import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-discord-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        @if (erro()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{{ erro() }}</div>
          <a routerLink="/login" class="text-blue-600 hover:underline">Voltar ao login</a>
        } @else {
          <p class="text-gray-600">Autenticando com Discord...</p>
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
