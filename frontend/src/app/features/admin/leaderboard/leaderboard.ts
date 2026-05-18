import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { LeaderboardEntryResponse } from '../../../core/models/session.model';

@Component({
  selector: 'app-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }

    .card {
      border: 1px solid var(--app-border);
      background: var(--app-surface);
      transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
    }
    .podium:hover {
      transform: translateY(-2px);
      border-color: var(--app-accent-border);
      background: var(--app-accent-soft);
    }
    .podium-1 { border-color: var(--app-accent-border); }

    .row { transition: background-color 150ms ease; }
    .row:hover { background: var(--app-surface); }
  `],
  template: `
    <header class="mb-6">
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">Ranking</p>
      <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
        @if (entradas().length > 0) {
          {{ entradas().length }} {{ entradas().length === 1 ? 'dev na disputa.' : 'devs na disputa.' }}
        } @else {
          Leaderboard
        }
      </h1>
    </header>

    @if (carregando()) {
      <div class="card rounded-2xl p-8 text-center font-mono text-sm text-muted">Carregando...</div>
    } @else if (entradas().length === 0) {
      <div class="card rounded-2xl p-8 text-center font-mono text-sm text-muted">Nenhum registro encontrado.</div>
    } @else {
      <div class="mb-6 grid gap-4 sm:grid-cols-3">
        @for (d of podio(); track d.posicao) {
          <div class="card podium rounded-2xl p-5" [class.podium-1]="d.posicao === 1">
            <div class="flex items-start justify-between">
              <span
                class="flex h-7 w-7 items-center justify-center rounded-md font-mono text-sm font-bold"
                [style.background]="d.posicao === 1 ? '#2dd4bf' : 'var(--app-surface-2)'"
                [style.color]="d.posicao === 1 ? '#020617' : '#cbd5e1'"
              >{{ d.posicao }}</span>
              @if (d.currentStreak > 0) {
                <span class="font-mono text-xs text-muted">{{ d.currentStreak }}d ofensiva</span>
              }
            </div>
            <div class="mt-5 flex items-center gap-3">
              @if (d.avatarUrl) {
                <img [src]="d.avatarUrl" [alt]="d.nomeUsuario" class="h-9 w-9 rounded-full object-cover" />
              } @else {
                <span class="flex h-9 w-9 items-center justify-center rounded-full border border-app bg-surface-2 text-sm font-bold text-heading">
                  {{ d.nomeUsuario.charAt(0).toUpperCase() }}
                </span>
              }
              <p class="min-w-0 truncate font-semibold text-heading">{{ d.nomeUsuario }}</p>
            </div>
            <div class="mt-5 flex items-center justify-between border-t border-app-soft pt-4">
              <span class="font-mono text-xs uppercase tracking-[0.16em] text-muted">Foco</span>
              <span class="font-mono text-lg font-bold text-heading">{{ formatarHoras(d.totalMinutos) }}</span>
            </div>
          </div>
        }
      </div>

      @if (resto().length > 0) {
        <div class="card overflow-hidden rounded-2xl">
          <div class="hidden grid-cols-[3rem_1fr_12rem_5rem] gap-4 border-b border-app-soft px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-faint sm:grid">
            <span>#</span><span>Dev</span><span>Foco</span><span>Streak</span>
          </div>
          @for (r of resto(); track r.posicao) {
            <div class="row grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-app-soft px-5 py-4 last:border-0 sm:grid-cols-[3rem_1fr_12rem_5rem]">
              <span class="font-mono text-sm text-muted">{{ pad(r.posicao) }}</span>
              <div class="flex min-w-0 items-center gap-3">
                @if (r.avatarUrl) {
                  <img [src]="r.avatarUrl" [alt]="r.nomeUsuario" class="h-8 w-8 flex-shrink-0 rounded-full object-cover" />
                } @else {
                  <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-heading">
                    {{ r.nomeUsuario.charAt(0).toUpperCase() }}
                  </span>
                }
                <p class="min-w-0 truncate font-semibold text-heading">{{ r.nomeUsuario }}</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="hidden h-1.5 w-24 overflow-hidden rounded-full bg-surface-2 sm:block">
                  <div class="h-full rounded-full bg-[rgba(148,163,184,0.5)]" [style.width.%]="barraPct(r.totalMinutos)"></div>
                </div>
                <span class="font-mono text-sm font-bold text-heading">{{ formatarHoras(r.totalMinutos) }}</span>
              </div>
              <span class="hidden sm:inline">
                @if (r.currentStreak > 0) {
                  <span class="rounded-md border border-app px-2 py-1 font-mono text-[11px] text-muted">{{ r.currentStreak }}d</span>
                } @else {
                  <span class="font-mono text-xs text-faint">—</span>
                }
              </span>
            </div>
          }
        </div>
      }
    }
  `,
})
export class Leaderboard implements OnInit {
  private readonly sessionService = inject(SessionService);
  readonly entradas = signal<LeaderboardEntryResponse[]>([]);
  readonly carregando = signal(true);

  readonly podio = computed(() => this.entradas().slice(0, 3));
  readonly resto = computed(() => this.entradas().slice(3));
  private readonly maxMinutos = computed(() =>
    this.entradas().reduce((m, e) => Math.max(m, e.totalMinutos), 0),
  );

  ngOnInit(): void {
    this.sessionService.listarLeaderboard().subscribe({
      next: (data) => {
        this.entradas.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  barraPct(minutos: number): number {
    const max = this.maxMinutos();
    return max > 0 ? Math.round((minutos / max) * 100) : 0;
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  formatarHoras(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h}h ${m}min`;
  }
}
