import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { SessionService } from '../../core/services/session.service';
import { StreakResponse, StudySessionResponse } from '../../core/models/session.model';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Minhas Sessões</h1>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          @if (carregando()) {
            <div class="p-6 text-center text-gray-500">Carregando...</div>
          } @else if (registros().length === 0) {
            <div class="p-6 text-center text-gray-500">Nenhuma sessão registrada.</div>
          } @else {
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Início</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fim</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tempo</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (r of registros(); track r.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ r.startedAt | date:'dd/MM/yyyy' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ r.startedAt | date:'HH:mm:ss' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      @if (r.endedAt) { {{ r.endedAt | date:'HH:mm:ss' }} }
                      @else { <span class="text-yellow-600 font-medium">Em aberto</span> }
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      @if (r.minutosEstudados > 0) { {{ formatarHoras(r.minutosEstudados) }} }
                      @else { — }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
        @if (auth.eAdmin()) {
          <h2 class="text-lg font-semibold text-gray-700 mt-8 mb-4">Administração</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a routerLink="/sessions" class="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow block">
              <h3 class="font-semibold text-gray-700 mb-1">Registros de Sessões</h3>
              <p class="text-sm text-gray-500">Consultar sessões de todos os usuários.</p>
            </a>
            <a routerLink="/usuarios" class="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow block">
              <h3 class="font-semibold text-gray-700 mb-1">Gerenciar Usuários</h3>
              <p class="text-sm text-gray-500">Visualizar usuários do sistema.</p>
            </a>
          </div>
        }
      </div>
      <div class="lg:w-80 flex-shrink-0">
        <div class="bg-white rounded-lg shadow p-6 text-center lg:sticky lg:top-6">
          <p class="text-4xl font-mono font-bold text-gray-800 mb-1">{{ horaAtual() }}</p>
          <p class="text-sm text-gray-500 mb-5">{{ dataAtual() }}</p>
          @if (sessaoAberta()) {
            <div class="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded mb-4 text-sm">
              <div class="text-2xl font-mono font-bold">{{ tempoSessaoAtual() }}</div>
              <div class="text-xs text-green-600 mt-1">
                Sessão aberta desde {{ startedAtAberta() | date:'HH:mm:ss' }}
              </div>
            </div>
          } @else {
            <div class="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-2 rounded mb-4 text-sm">
              Nenhuma sessão aberta
            </div>
          }
          <div class="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded mb-4 text-sm">
            Total: <span class="font-bold">{{ formatarHoras(totalMinutos()) }}</span>
          </div>
          @if (streak(); as s) {
            <div class="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded mb-4 text-sm">
              <div class="text-2xl font-bold">
                {{ s.studiedToday ? '🔥' : '⚪' }} {{ s.currentStreak }}
                <span class="text-sm font-normal">{{ s.currentStreak === 1 ? 'dia' : 'dias' }} seguidos</span>
              </div>
              <div class="text-xs text-orange-500 mt-1">Recorde: {{ s.longestStreak }} dias</div>
            </div>
          }
          <p class="text-xs text-gray-400 mt-2">
            Sessões são registradas automaticamente ao entrar/sair de canais de voz no Discord.
          </p>
          <p class="text-xs text-gray-400 mt-4">Olá, {{ auth.usuarioLogado()?.nome }}</p>
        </div>
      </div>
    </div>
  `,
})
export class Dashboard implements OnInit, OnDestroy {
  readonly auth = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly sessaoAberta = signal(false);
  readonly startedAtAberta = signal<string | null>(null);
  readonly registros = signal<StudySessionResponse[]>([]);
  readonly streak = signal<StreakResponse | null>(null);
  readonly carregando = signal(true);
  readonly horaAtual = signal('');
  readonly dataAtual = signal('');
  readonly agora = signal(Date.now());

  private readonly segundosSessaoAtual = computed(() => {
    if (!this.sessaoAberta()) return 0;
    const inicio = this.startedAtAberta();
    if (!inicio) return 0;
    const diff = Math.floor((this.agora() - new Date(inicio).getTime()) / 1000);
    return diff > 0 ? diff : 0;
  });

  readonly tempoSessaoAtual = computed(() => {
    const total = this.segundosSessaoAtual();
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  });

  readonly totalMinutos = computed(
    () =>
      this.registros().reduce((acc, r) => acc + r.minutosEstudados, 0) +
      Math.floor(this.segundosSessaoAtual() / 60),
  );

  private intervalo: ReturnType<typeof setInterval> | null = null;
  private pollIntervalo: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.atualizarRelogio();
      this.intervalo = setInterval(() => this.atualizarRelogio(), 1000);
      this.pollIntervalo = setInterval(() => this.sincronizarBackend(), 15000);
    }
    this.carregarEstado();
    this.carregarRegistros();
    this.carregarStreak();
  }

  ngOnDestroy(): void {
    if (this.intervalo) clearInterval(this.intervalo);
    if (this.pollIntervalo) clearInterval(this.pollIntervalo);
  }

  private sincronizarBackend(): void {
    this.carregarEstado();
    this.carregarRegistros();
    this.carregarStreak();
  }

  private carregarStreak(): void {
    this.sessionService.streak().subscribe({
      next: (s) => this.streak.set(s),
    });
  }

  formatarHoras(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}min`;
  }

  private carregarEstado(): void {
    this.sessionService.verificarAberta().subscribe({
      next: (res) => {
        this.sessaoAberta.set(res.aberta);
        this.startedAtAberta.set(res.startedAt);
      },
    });
  }

  private carregarRegistros(): void {
    this.sessionService.listarMinhas().subscribe({
      next: (registros) => {
        this.registros.set(registros);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  private atualizarRelogio(): void {
    const agora = new Date();
    this.agora.set(agora.getTime());
    this.horaAtual.set(agora.toLocaleTimeString('pt-BR'));
    this.dataAtual.set(
      agora.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    );
  }
}
