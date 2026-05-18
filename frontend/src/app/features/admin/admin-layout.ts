import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeToggle } from '../../core/components/theme-toggle';

@Component({
  selector: 'app-admin-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle],
  styles: [`
    :host { display: block; }

    .shell {
      min-height: 100vh;
      background:
        radial-gradient(circle at 88% 6%, var(--app-accent-soft), transparent 28%),
        var(--app-bg);
    }

    .nav {
      border-bottom: 1px solid var(--app-border-soft);
      background: var(--app-nav-bg);
      backdrop-filter: blur(14px);
    }

    .nav-link {
      position: relative;
      transition: color 160ms ease;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1.05rem;
      height: 2px;
      background: var(--app-accent);
      opacity: 0;
      transition: opacity 160ms ease;
    }
    .nav-link.active { color: var(--app-heading); }
    .nav-link.active::after { opacity: 1; }

    .scroll-x { scrollbar-width: none; -ms-overflow-style: none; }
    .scroll-x::-webkit-scrollbar { display: none; }
  `],
  template: `
    <div class="shell text-app">
      <nav class="nav sticky top-0 z-20">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-5">
            <div class="flex items-center gap-2.5">
              <span class="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-extrabold text-white">A</span>
              <span class="text-sm font-bold tracking-[0.14em] text-heading">ACELERA <span class="font-medium italic text-accent">DEV</span></span>
            </div>
            <span class="hidden rounded-full border border-app bg-surface px-2.5 py-1 font-mono text-[11px] text-muted sm:inline">studycheck v0.4</span>
          </div>

          <div class="scroll-x -mx-2 overflow-x-auto px-2">
            <div class="flex min-w-max items-center gap-7 text-sm font-medium text-muted">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link whitespace-nowrap hover:text-heading">Painel</a>
              <a routerLink="/leaderboard" routerLinkActive="active" class="nav-link whitespace-nowrap hover:text-heading">Ranking</a>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="hidden text-sm text-app sm:inline">{{ auth.usuarioLogado()?.nome }}</span>
            <span class="flex h-8 w-8 items-center justify-center rounded-full border border-app bg-surface-2 text-xs font-bold text-heading">{{ iniciais() }}</span>
            <app-theme-toggle />
            <button
              type="button"
              (click)="auth.logout()"
              class="text-sm font-medium text-muted transition-colors hover:text-red-400"
            >Sair</button>
          </div>
        </div>
      </nav>

      <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayout {
  readonly auth = inject(AuthService);

  readonly iniciais = computed(() => {
    const nome = this.auth.usuarioLogado()?.nome ?? '';
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '—';
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  });
}
