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

    .hm-grid { display: flex; gap: 3px; }
    .hm-col { display: flex; flex-direction: column; gap: 3px; }
    .hm-cell {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      background: var(--app-surface-2);
      transition: transform 120ms ease, outline-color 120ms ease;
      outline: 1px solid transparent;
    }
    .hm-cell.lvl1 { background: color-mix(in srgb, var(--app-accent) 26%, transparent); }
    .hm-cell.lvl2 { background: color-mix(in srgb, var(--app-accent) 48%, transparent); }
    .hm-cell.lvl3 { background: color-mix(in srgb, var(--app-accent) 72%, transparent); }
    .hm-cell.lvl4 { background: var(--app-accent); }
    .hm-cell.has-data:hover { transform: scale(1.25); outline-color: var(--app-accent); }
    .hm-cell.empty { background: transparent; }
    .hm-scroll { scrollbar-width: thin; }
    .yr-btn { transition: background-color 140ms ease, color 140ms ease; }
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

    <section class="card mb-6 rounded-2xl p-5">
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="font-semibold text-heading">Ofensiva de estudo</h2>
          <p class="mt-1 font-mono text-xs text-muted">
            {{ calendario().diasAtivos }} dias com foco em {{ anoSelecionado() }} ·
            {{ formatarHoras(calendario().totalAno) }}
          </p>
        </div>
        <div class="flex flex-wrap gap-1 rounded-lg border border-app-soft p-1 text-xs">
          @for (a of anosDisponiveis(); track a) {
            <button
              type="button"
              (click)="anoSelecionado.set(a)"
              class="yr-btn rounded-md px-2.5 py-1 font-mono"
              [style.background]="anoSelecionado() === a ? 'var(--app-accent-soft)' : 'transparent'"
              [style.color]="anoSelecionado() === a ? 'var(--app-accent)' : 'var(--app-muted)'"
            >{{ a }}</button>
          }
        </div>
      </div>

      <div class="hm-scroll overflow-x-auto pb-1">
        <div class="inline-flex flex-col gap-1.5">
          <div class="flex pl-[1.875rem] font-mono text-[10px] text-faint">
            @for (lbl of calendario().mesesCols; track $index) {
              <span class="block overflow-visible whitespace-nowrap" style="width:15px">{{ lbl }}</span>
            }
          </div>
          <div class="flex gap-2">
            <div class="flex flex-col gap-[3px] pt-[1px] font-mono text-[10px] text-faint">
              <span style="height:12px"></span>
              <span style="height:12px">seg</span>
              <span style="height:12px"></span>
              <span style="height:12px">qua</span>
              <span style="height:12px"></span>
              <span style="height:12px">sex</span>
              <span style="height:12px"></span>
            </div>
            <div class="hm-grid">
              @for (sem of calendario().semanas; track $index) {
                <div class="hm-col">
                  @for (cel of sem; track $index) {
                    @if (cel) {
                      <span
                        class="hm-cell"
                        [class.lvl1]="cel.nivel === 1"
                        [class.lvl2]="cel.nivel === 2"
                        [class.lvl3]="cel.nivel === 3"
                        [class.lvl4]="cel.nivel === 4"
                        [class.has-data]="cel.minutos > 0"
                        [title]="cel.titulo"
                      ></span>
                    } @else {
                      <span class="hm-cell empty"></span>
                    }
                  }
                </div>
              }
            </div>
          </div>
          <div class="flex items-center justify-end gap-1.5 pt-1 font-mono text-[10px] text-faint">
            <span>menos</span>
            <span class="hm-cell"></span>
            <span class="hm-cell lvl1"></span>
            <span class="hm-cell lvl2"></span>
            <span class="hm-cell lvl3"></span>
            <span class="hm-cell lvl4"></span>
            <span>mais</span>
          </div>
        </div>
      </div>
    </section>

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

  readonly anoSelecionado = signal(new Date().getFullYear());

  private readonly mapaDias = computed(() => {
    const mapa = new Map<string, number>();
    for (const r of this.registros()) {
      if (!r.startedAt || r.minutosEstudados <= 0) continue;
      const d = new Date(r.startedAt);
      const chave = this.chaveData(d);
      mapa.set(chave, (mapa.get(chave) ?? 0) + r.minutosEstudados);
    }
    return mapa;
  });

  readonly anosDisponiveis = computed(() => {
    const anos = new Set<number>([new Date().getFullYear()]);
    for (const r of this.registros()) {
      if (r.startedAt) anos.add(new Date(r.startedAt).getFullYear());
    }
    return [...anos].sort((a, b) => b - a);
  });

  readonly calendario = computed(() => {
    const ano = this.anoSelecionado();
    const mapa = this.mapaDias();
    const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

    const semanas: ({ minutos: number; nivel: number; titulo: string } | null)[][] = [];
    const mesesCols: string[] = [];
    let coluna: ({ minutos: number; nivel: number; titulo: string } | null)[] = [];

    const inicio = new Date(ano, 0, 1);
    const fim = new Date(ano, 11, 31);
    let totalAno = 0;
    let diasAtivos = 0;
    let mesAnterior = -1;

    // preenche dias vazios antes de 1º jan dentro da primeira semana (dom..sáb)
    for (let i = 0; i < inicio.getDay(); i++) coluna.push(null);

    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      const chave = this.chaveData(d);
      const min = mapa.get(chave) ?? 0;
      if (min > 0) {
        totalAno += min;
        diasAtivos++;
      }
      const dataBr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${ano}`;
      coluna.push({
        minutos: min,
        nivel: this.nivelHeatmap(min),
        titulo: min > 0 ? `${dataBr} · ${this.formatarHoras(min)}` : `${dataBr} · sem foco`,
      });

      if (d.getDay() === 6) {
        semanas.push(coluna);
        coluna = [];
      }
    }
    if (coluna.length > 0) {
      while (coluna.length < 7) coluna.push(null);
      semanas.push(coluna);
    }

    // rótulo de mês na 1ª semana em que o mês muda
    for (let i = 0; i < semanas.length; i++) {
      const primeira = this.primeiraDataDaSemana(i, ano);
      if (primeira && primeira.getMonth() !== mesAnterior) {
        mesesCols[i] = meses[primeira.getMonth()];
        mesAnterior = primeira.getMonth();
      } else {
        mesesCols[i] = '';
      }
    }

    return { semanas, mesesCols, totalAno, diasAtivos };
  });

  private chaveData(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private nivelHeatmap(min: number): number {
    if (min <= 0) return 0;
    if (min < 30) return 1;
    if (min < 60) return 2;
    if (min < 120) return 3;
    return 4;
  }

  private primeiraDataDaSemana(coluna: number, ano: number): Date | null {
    const inicio = new Date(ano, 0, 1);
    const primeiroDiaCol = coluna * 7 - inicio.getDay();
    if (primeiroDiaCol < 0) return new Date(ano, 0, 1);
    const d = new Date(ano, 0, 1 + primeiroDiaCol);
    return d.getFullYear() === ano ? d : null;
  }

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
