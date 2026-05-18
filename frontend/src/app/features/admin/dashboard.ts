import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { SessionService } from '../../core/services/session.service';
import { StreakResponse, StudySessionResponse } from '../../core/models/session.model';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  styles: [`
    :host { display: block; }

    .card {
      border: 1px solid var(--app-border);
      background: var(--app-surface);
      transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
    }
    .card-hover:hover {
      transform: translateY(-2px);
      border-color: var(--app-accent-border);
      background: var(--app-accent-soft);
    }

    .session-card {
      border: 1px solid var(--app-accent-border);
      background:
        radial-gradient(circle at 90% 0%, var(--app-accent-soft), transparent 60%),
        var(--app-accent-soft);
      box-shadow: inset 0 1px 0 var(--app-accent-soft);
    }

    .recent-row { transition: background-color 150ms ease; }
    .recent-row:hover { background: var(--app-surface); }
  `],
  template: `
    <header class="mb-8">
      <p class="font-mono text-xs uppercase tracking-[0.2em] text-muted">{{ dataAtual() }} · {{ horaAtual() }}</p>
    </header>

    <div class="mb-6 grid gap-5 lg:grid-cols-[1fr_22rem]">
      <div class="self-end">
        <h1 class="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">Olá, {{ auth.usuarioLogado()?.nome }}.</h1>
        <p class="mt-3 text-[15px] leading-7 text-muted">
          Sessões são registradas automaticamente ao entrar/sair de canais de voz no Discord.
        </p>
      </div>

      @if (sessaoAberta()) {
        <div class="session-card rounded-2xl p-5">
          <span class="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-accent">
            <span class="h-1.5 w-1.5 rounded-full bg-accent"></span> sessão ativa
          </span>
          <p class="mt-4 font-mono text-4xl font-bold tracking-tight text-heading">{{ tempoSessaoAtual() }}</p>
          <p class="mt-2 font-mono text-xs text-muted">desde {{ startedAtAberta() | date:'HH:mm:ss' }}</p>
        </div>
      } @else {
        <div class="card rounded-2xl p-5">
          <span class="font-mono text-xs uppercase tracking-[0.18em] text-muted">sessão</span>
          <p class="mt-4 font-mono text-2xl font-bold text-muted">nenhuma aberta</p>
          <p class="mt-2 font-mono text-xs text-faint">entre numa call do Discord</p>
        </div>
      }
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
      <div class="card card-hover rounded-2xl p-5">
        <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted">Total acumulado</p>
        <p class="mt-3 font-mono text-2xl font-bold text-heading">{{ formatarHoras(totalMinutos()) }}</p>
      </div>
      <div class="card card-hover rounded-2xl p-5">
        <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted">Ofensiva</p>
        <p class="mt-3 font-mono text-2xl font-bold text-heading">
          {{ streak()?.currentStreak ?? 0 }} <span class="text-sm font-normal text-muted">{{ (streak()?.currentStreak ?? 0) === 1 ? 'dia' : 'dias' }}</span>
        </p>
        <p class="mt-1 font-mono text-xs text-muted">
          {{ streak()?.studiedToday ? 'estudou hoje' : 'sem foco hoje' }}
        </p>
      </div>
      <div class="card card-hover rounded-2xl p-5">
        <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted">Recorde</p>
        <p class="mt-3 font-mono text-2xl font-bold text-heading">
          {{ streak()?.longestStreak ?? 0 }} <span class="text-sm font-normal text-muted">dias</span>
        </p>
      </div>
    </div>

    <section class="card rounded-2xl">
      <div class="flex items-center justify-between border-b border-app-soft px-5 py-4">
        <h2 class="font-semibold text-heading">Minhas sessões</h2>
        <span class="font-mono text-xs text-muted">{{ registros().length }} registro(s)</span>
      </div>
      @if (carregando()) {
        <div class="p-8 text-center font-mono text-sm text-muted">Carregando...</div>
      } @else if (registros().length === 0) {
        <div class="p-8 text-center font-mono text-sm text-muted">Nenhuma sessão registrada.</div>
      } @else {
        <div class="overflow-x-auto">
          <table class="w-full min-w-[40rem]">
            <thead>
              <tr class="border-b border-app-soft text-left font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                <th class="px-5 py-3 font-medium">Data</th>
                <th class="px-5 py-3 font-medium">Início</th>
                <th class="px-5 py-3 font-medium">Fim</th>
                <th class="px-5 py-3 font-medium">Tempo</th>
              </tr>
            </thead>
            <tbody>
              @for (r of registros(); track r.id) {
                <tr class="recent-row border-b border-app-soft last:border-0">
                  <td class="whitespace-nowrap px-5 py-4 font-mono text-sm text-app">{{ r.startedAt | date:'dd/MM/yyyy' }}</td>
                  <td class="whitespace-nowrap px-5 py-4 font-mono text-sm text-muted">{{ r.startedAt | date:'HH:mm:ss' }}</td>
                  <td class="whitespace-nowrap px-5 py-4 font-mono text-sm text-muted">
                    @if (r.endedAt) { {{ r.endedAt | date:'HH:mm:ss' }} }
                    @else { <span class="font-medium text-accent">em aberto</span> }
                  </td>
                  <td class="whitespace-nowrap px-5 py-4 font-mono text-sm font-medium text-heading">
                    @if (r.minutosEstudados > 0) { {{ formatarHoras(r.minutosEstudados) }} }
                    @else { <span class="text-faint">—</span> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
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
