import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { LeaderboardEntryResponse } from '../../../core/models/session.model';

@Component({
  selector: 'app-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Leaderboard</h1>
    @if (carregando()) {
      <div class="text-center text-gray-500 dark:text-gray-400 py-8">Carregando...</div>
    } @else if (entradas().length === 0) {
      <div class="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum registro encontrado.</div>
    } @else {
      <div class="space-y-3">
        @for (entry of entradas(); track entry.posicao) {
          <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow px-5 py-4 flex items-center gap-4"
               [class.ring-2]="entry.posicao <= 3"
               [class.ring-yellow-400]="entry.posicao === 1"
               [class.ring-gray-300]="entry.posicao === 2"
               [class.ring-amber-600]="entry.posicao === 3">
            <span class="text-2xl font-bold w-10 text-center"
                  [class.text-yellow-500]="entry.posicao === 1"
                  [class.text-gray-400]="entry.posicao === 2"
                  [class.text-amber-600]="entry.posicao === 3"
                  [class.text-gray-500]="entry.posicao > 3">
              {{ entry.posicao }}
            </span>
            @if (entry.avatarUrl) {
              <img [src]="entry.avatarUrl" [alt]="entry.nomeUsuario" class="w-10 h-10 rounded-full object-cover" />
            } @else {
              <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-sm">
                {{ entry.nomeUsuario.charAt(0).toUpperCase() }}
              </div>
            }
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ entry.nomeUsuario }}</p>
              @if (entry.currentStreak > 0) {
                <p class="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  🔥 {{ entry.currentStreak }} {{ entry.currentStreak === 1 ? 'dia' : 'dias' }} seguidos
                </p>
              }
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-700 dark:text-gray-200">{{ formatarHoras(entry.totalMinutos) }}</p>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class Leaderboard implements OnInit {
  private readonly sessionService = inject(SessionService);
  readonly entradas = signal<LeaderboardEntryResponse[]>([]);
  readonly carregando = signal(true);

  ngOnInit(): void {
    this.sessionService.listarLeaderboard().subscribe({
      next: (data) => {
        this.entradas.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  formatarHoras(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = Math.round(minutos % 60);
    return `${h}h ${m}min`;
  }
}
