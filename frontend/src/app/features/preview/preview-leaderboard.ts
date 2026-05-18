import { ChangeDetectionStrategy, Component } from '@angular/core';

type PreviewEntry = {
  posicao: number;
  nomeUsuario: string;
  totalMinutos: number;
  currentStreak: number;
  avatarUrl?: string | null;
};

@Component({
  selector: 'app-preview-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      display: block;
    }

    .leaderboard-card {
      cursor: pointer;
      transition:
        transform 180ms ease,
        border-color 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease;
    }

    .leaderboard-card:hover {
      transform: translateY(-2px) scale(1.01);
      border-color: rgba(251, 146, 60, 0.35);
      box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
    }

    :host-context(.dark) .leaderboard-card:hover {
      border-color: rgba(255, 128, 47, 0.25);
      box-shadow: 0 18px 34px rgba(0, 0, 0, 0.24);
    }

    .leaderboard-card {
      border-color: rgba(203, 213, 225, 0.82);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(248, 250, 252, 0.64));
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 40px rgba(148, 163, 184, 0.12);
    }

    :host-context(.dark) .leaderboard-card {
      border: 1px solid rgba(255, 255, 255, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.035));
      box-shadow: none;
    }
  `],
  template: `
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-white/42">Comunidade</p>
        <h1 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Leaderboard</h1>
      </div>
      <div class="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm dark:border-white/12 dark:bg-white/[0.05] dark:text-white/72">
        Atualizado agora • ranking semanal
      </div>
    </div>
    <div class="space-y-3">
      @for (entry of entradas; track entry.posicao) {
        <button
          type="button"
          class="leaderboard-card flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left"
          [class.ring-2]="entry.posicao <= 3"
          [class.ring-yellow-400]="entry.posicao === 1"
          [class.ring-gray-300]="entry.posicao === 2"
          [class.ring-amber-600]="entry.posicao === 3"
        >
          <span
            class="w-10 text-center text-2xl font-bold text-slate-400 dark:text-slate-500"
            [class.text-yellow-500]="entry.posicao === 1"
            [class.text-gray-400]="entry.posicao === 2"
            [class.text-amber-600]="entry.posicao === 3"
          >
            {{ entry.posicao }}
          </span>
          <div class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white/70 text-sm font-bold text-slate-700 dark:border-white/20 dark:bg-white/[0.06] dark:text-white/72">
            {{ entry.nomeUsuario.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate font-semibold text-slate-950 dark:text-white">{{ entry.nomeUsuario }}</p>
            @if (entry.currentStreak > 0) {
              <p class="text-xs font-medium text-orange-600 dark:text-orange-400">
                🔥 {{ entry.currentStreak }} {{ entry.currentStreak === 1 ? 'dia' : 'dias' }} seguidos
              </p>
            }
          </div>
          <div class="text-right">
            <p class="font-bold text-slate-900 dark:text-white">{{ formatarHoras(entry.totalMinutos) }}</p>
          </div>
        </button>
      }
    </div>
  `,
})
export class PreviewLeaderboard {
  protected readonly entradas: PreviewEntry[] = [
    { posicao: 1, nomeUsuario: 'Willian', totalMinutos: 1120, currentStreak: 6 },
    { posicao: 2, nomeUsuario: 'Claudia', totalMinutos: 980, currentStreak: 4 },
    { posicao: 3, nomeUsuario: 'Reis', totalMinutos: 870, currentStreak: 3 },
    { posicao: 4, nomeUsuario: 'Luan', totalMinutos: 810, currentStreak: 8 },
  ];

  protected formatarHoras(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h}h ${m}min`;
  }
}
