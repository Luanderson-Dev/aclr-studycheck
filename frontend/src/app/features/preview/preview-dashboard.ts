import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatePipe } from '@angular/common';

type PreviewSession = {
  id: number;
  startedAt: string;
  endedAt: string | null;
  minutosEstudados: number;
};

@Component({
  selector: 'app-preview-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  styles: [`
    :host {
      display: block;
    }

    .preview-button {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease,
        background-color 180ms ease,
        color 180ms ease;
    }

    .preview-button::before {
      content: '';
      position: absolute;
      left: 8%;
      right: 8%;
      bottom: -42%;
      height: 82%;
      border-radius: 9999px;
      filter: blur(16px);
      opacity: 0.78;
      pointer-events: none;
    }

    .preview-button::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
    }

    .preview-button:hover {
      transform: translateY(-2px) scale(1.018);
      box-shadow: 0 12px 30px rgba(255, 128, 47, 0.16);
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.08)) padding-box,
        linear-gradient(120deg, rgba(255, 128, 47, 0.95), rgba(255, 59, 48, 0.9), rgba(217, 70, 239, 0.88)) border-box;
    }

    .preview-button--primary {
      border: 0;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(248, 250, 252, 0.62));
      box-shadow: 0 12px 28px rgba(148, 163, 184, 0.1);
      color: #0f172a;
    }

    .preview-button--primary::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(191, 219, 254, 0.46) 0%, rgba(129, 140, 248, 0.2) 28%, transparent 72%);
    }

    .preview-button--primary::after {
      border: 0;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.44),
        inset 0 -18px 34px rgba(255, 255, 255, 0.04);
    }

    :host-context(.dark) .preview-button--primary {
      border: 0;
      background:
        linear-gradient(180deg, rgba(9, 11, 16, 0.98), rgba(8, 9, 13, 0.96));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 12px 26px rgba(0, 0, 0, 0.18);
      color: #fff;
    }

    :host-context(.dark) .preview-button--primary::before {
      background:
        radial-gradient(circle at 18% 100%, rgba(255, 164, 85, 0.34) 0%, rgba(255, 124, 47, 0.26) 18%, transparent 44%),
        radial-gradient(circle at 52% 100%, rgba(191, 219, 254, 0.34) 0%, rgba(129, 140, 248, 0.24) 22%, transparent 50%),
        radial-gradient(circle at 86% 100%, rgba(244, 114, 182, 0.28) 0%, rgba(217, 70, 239, 0.2) 18%, transparent 44%);
      opacity: 0.9;
    }

    :host-context(.dark) .preview-button--primary::after {
      border: 0;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        inset 0 -18px 34px rgba(255, 255, 255, 0.01);
    }

    .panel-action {
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition:
        transform 180ms ease,
        border-color 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease;
    }

    .panel-action:hover {
      transform: translateY(-2px) scale(1.01);
      border-color: rgba(251, 146, 60, 0.35);
      box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
    }

    :host-context(.dark) .panel-action:hover {
      border-color: rgba(255, 128, 47, 0.25);
      box-shadow: 0 18px 34px rgba(0, 0, 0, 0.24);
    }

    .metric-card {
      border: 1px solid rgba(203, 213, 225, 0.8);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 250, 252, 0.68));
      box-shadow: 0 16px 34px rgba(148, 163, 184, 0.12);
    }

    .metric-card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0.95;
    }

    .metric-card::after {
      content: '';
      position: absolute;
      left: 10%;
      right: 10%;
      bottom: -38%;
      height: 68%;
      border-radius: 9999px;
      filter: blur(18px);
      opacity: 0.72;
      pointer-events: none;
    }

    .metric-card--rank::before {
      border: 1px solid rgba(99, 102, 241, 0.24);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .metric-card--rank::after {
      background: radial-gradient(circle at 50% 100%, rgba(191, 219, 254, 0.88) 0%, rgba(129, 140, 248, 0.44) 26%, transparent 72%);
    }

    .metric-card--focus::before {
      border: 1px solid rgba(217, 70, 239, 0.22);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .metric-card--focus::after {
      background: radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.82) 0%, rgba(217, 70, 239, 0.4) 24%, transparent 72%);
    }

    .metric-card--streak::before {
      border: 1px solid rgba(251, 146, 60, 0.22);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .metric-card--streak::after {
      background: radial-gradient(circle at 50% 100%, rgba(254, 240, 138, 0.86) 0%, rgba(251, 146, 60, 0.42) 22%, rgba(239, 68, 68, 0.18) 44%, transparent 72%);
    }

    :host-context(.dark) .metric-card {
      border-color: rgba(255, 255, 255, 0.08);
      background: linear-gradient(180deg, rgba(8, 10, 14, 0.98), rgba(8, 9, 13, 0.95));
      box-shadow: none;
    }

    :host-context(.dark) .metric-card::before {
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    :host-context(.dark) .metric-card::after {
      opacity: 0.92;
      filter: blur(20px);
    }

    :host-context(.dark) .metric-card--rank::before {
      border-color: rgba(129, 140, 248, 0.34);
    }

    :host-context(.dark) .metric-card--rank::after {
      background: radial-gradient(circle at 50% 100%, rgba(191, 219, 254, 0.92) 0%, rgba(129, 140, 248, 0.62) 24%, rgba(79, 70, 229, 0.24) 48%, transparent 74%);
    }

    :host-context(.dark) .metric-card--focus::before {
      border-color: rgba(217, 70, 239, 0.32);
    }

    :host-context(.dark) .metric-card--focus::after {
      background: radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.88) 0%, rgba(217, 70, 239, 0.58) 24%, rgba(168, 85, 247, 0.2) 48%, transparent 74%);
    }

    :host-context(.dark) .metric-card--streak::before {
      border-color: rgba(251, 146, 60, 0.32);
    }

    :host-context(.dark) .metric-card--streak::after {
      background: radial-gradient(circle at 50% 100%, rgba(254, 240, 138, 0.92) 0%, rgba(251, 146, 60, 0.68) 20%, rgba(249, 115, 22, 0.26) 40%, transparent 74%);
    }

    .surface-card {
      border-color: rgba(203, 213, 225, 0.82);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(248, 250, 252, 0.64));
      backdrop-filter: blur(12px);
      box-shadow: 0 18px 40px rgba(148, 163, 184, 0.12);
    }

    :host-context(.dark) .surface-card {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.035));
      box-shadow: none;
    }

    .status-panel {
      position: relative;
      overflow: hidden;
      cursor: default;
      user-select: none;
    }

    :host-context(.dark) .status-panel {
      background:
        linear-gradient(180deg, rgba(17, 19, 24, 0.9), rgba(13, 14, 18, 0.86));
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 24px 48px rgba(0, 0, 0, 0.26);
    }

    :host-context(.dark) .status-panel::before {
      content: '';
      position: absolute;
      inset: auto -12% -18% auto;
      width: 18rem;
      height: 18rem;
      border-radius: 9999px;
      background:
        radial-gradient(circle, rgba(255, 124, 47, 0.16) 0%, rgba(255, 59, 48, 0.12) 34%, rgba(217, 70, 239, 0.08) 58%, transparent 78%);
      filter: blur(34px);
      pointer-events: none;
    }

    .status-card {
      position: relative;
      overflow: hidden;
      transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease;
    }

    .status-card:hover {
      transform: translateY(-2px);
    }

    .status-card::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -28%;
      height: 68%;
      border-radius: 9999px;
      filter: blur(18px);
      opacity: 0.82;
      pointer-events: none;
    }

    .status-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      opacity: 0.9;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.42),
        inset 0 -20px 40px rgba(255, 255, 255, 0.08);
    }

    .status-card--green::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(191, 219, 254, 0.88) 0%, rgba(129, 140, 248, 0.54) 26%, rgba(79, 70, 229, 0.2) 48%, transparent 74%);
    }

    .status-card--green::after {
      border: 1px solid rgba(129, 140, 248, 0.24);
    }

    .status-card--indigo::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.82) 0%, rgba(217, 70, 239, 0.48) 24%, rgba(168, 85, 247, 0.18) 48%, transparent 74%);
    }

    .status-card--indigo::after {
      border: 1px solid rgba(217, 70, 239, 0.22);
    }

    .status-card--orange::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(254, 240, 138, 0.88) 0%, rgba(251, 146, 60, 0.56) 20%, rgba(249, 115, 22, 0.24) 38%, rgba(239, 68, 68, 0.12) 54%, transparent 76%);
    }

    .status-card--orange::after {
      border: 1px solid rgba(251, 146, 60, 0.22);
    }

    :host-context(.dark) .status-card {
      background:
        linear-gradient(180deg, rgba(9, 11, 16, 0.96), rgba(12, 13, 18, 0.94));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }

    :host-context(.dark) .status-card::before {
      opacity: 0.9;
    }

    :host-context(.dark) .status-card::after {
      opacity: 0.8;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        inset 0 -20px 40px rgba(255, 255, 255, 0.01);
    }

    :host-context(.dark) .status-card--green::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(191, 219, 254, 0.92) 0%, rgba(129, 140, 248, 0.82) 24%, rgba(79, 70, 229, 0.42) 48%, transparent 74%);
    }

    :host-context(.dark) .status-card--green::after {
      border: 1px solid rgba(129, 140, 248, 0.3);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 0 0 1px rgba(129, 140, 248, 0.05);
    }

    :host-context(.dark) .status-card--indigo::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.9) 0%, rgba(217, 70, 239, 0.76) 24%, rgba(168, 85, 247, 0.4) 48%, transparent 74%);
    }

    :host-context(.dark) .status-card--indigo::after {
      border: 1px solid rgba(217, 70, 239, 0.28);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 0 0 1px rgba(217, 70, 239, 0.05);
    }

    :host-context(.dark) .status-card--orange::before {
      background:
        radial-gradient(circle at 50% 100%, rgba(254, 240, 138, 0.92) 0%, rgba(251, 146, 60, 0.88) 20%, rgba(249, 115, 22, 0.56) 38%, rgba(239, 68, 68, 0.26) 54%, transparent 76%);
    }

    :host-context(.dark) .status-card--orange::after {
      border: 1px solid rgba(251, 146, 60, 0.28);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 0 0 1px rgba(251, 146, 60, 0.05);
    }

    .preview-button:hover {
      box-shadow: 0 16px 34px rgba(99, 102, 241, 0.16);
      color: #0f172a;
    }

    :host-context(.dark) .preview-button:hover {
      box-shadow: 0 12px 30px rgba(255, 128, 47, 0.16);
      color: #fff;
    }

    .table-scroll {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .table-scroll::-webkit-scrollbar {
      display: none;
    }

    .static-card {
      cursor: default;
      user-select: none;
    }

    .static-card * {
      cursor: inherit;
    }
  `],
  template: `
    <div class="flex flex-col gap-6 lg:flex-row">
      <div class="min-w-0 flex-1">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-white/42">Painel</p>
            <h1 class="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Minhas Sessões</h1>
          </div>
          <div class="rounded-full border border-slate-200/80 bg-white/72 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm dark:border-white/12 dark:bg-white/5 dark:text-white/72">
            Semana atual • 19h 25min
          </div>
        </div>

        <div class="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            class="preview-button preview-button--primary rounded-[14px] px-4 py-3 text-sm font-medium sm:text-base"
          >
            <span class="relative z-10">Abrir sessão em destaque</span>
          </button>
          <button
            type="button"
            class="preview-button rounded-[14px] border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 backdrop-blur-sm sm:text-base dark:border-white/12 dark:bg-white/[0.04] dark:text-white/72"
          >
            Ver detalhes do dia
          </button>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button type="button" class="panel-action metric-card metric-card--rank rounded-2xl p-5 text-left">
            <p class="relative z-10 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-white/38">Ranking</p>
            <p class="relative z-10 mt-3 text-3xl font-bold text-slate-950 dark:text-white">#2</p>
            <p class="relative z-10 mt-1 text-sm text-slate-600 dark:text-white/62">Seu melhor ritmo da semana.</p>
          </button>
          <button type="button" class="panel-action metric-card metric-card--focus rounded-2xl p-5 text-left">
            <p class="relative z-10 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-white/38">Foco</p>
            <p class="relative z-10 mt-3 text-3xl font-bold text-slate-950 dark:text-white">1h 42m</p>
            <p class="relative z-10 mt-1 text-sm text-slate-600 dark:text-white/62">Sessao em andamento no momento.</p>
          </button>
          <button type="button" class="panel-action metric-card metric-card--streak rounded-2xl p-5 text-left">
            <p class="relative z-10 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-white/38">Sequencia</p>
            <p class="relative z-10 mt-3 text-3xl font-bold text-slate-950 dark:text-white">6 dias</p>
            <p class="relative z-10 mt-1 text-sm text-slate-600 dark:text-white/62">Constancia mantida sem quebrar.</p>
          </button>
        </div>

        <div class="static-card surface-card overflow-hidden rounded-3xl">
          <div class="flex flex-col gap-2 border-b border-slate-200/70 px-6 py-5 sm:flex-row sm:items-end sm:justify-between dark:border-white/8">
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-white/38">Historico</p>
              <h2 class="text-lg font-semibold text-slate-950 dark:text-white">Registros recentes</h2>
            </div>
            <p class="text-sm text-slate-600 dark:text-white/62">Tudo que foi contabilizado nas ultimas sessoes.</p>
          </div>
          <div class="table-scroll overflow-x-auto">
            <table class="min-w-[40rem] w-full divide-y divide-slate-200/70 dark:divide-white/10">
              <thead class="bg-white/30 dark:bg-white/[0.03]">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-white/38">Data</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-white/38">Início</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-white/38">Fim</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-white/38">Tempo</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/70 bg-transparent dark:divide-white/10">
                @for (r of registros; track r.id) {
                  <tr class="hover:bg-white/40 dark:hover:bg-white/[0.03]">
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{{ r.startedAt | date:'dd/MM/yyyy' }}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-white/62">{{ r.startedAt | date:'HH:mm:ss' }}</td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-white/62">
                      @if (r.endedAt) { {{ r.endedAt | date:'HH:mm:ss' }} }
                      @else { <span class="font-medium text-yellow-400">Em aberto</span> }
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-white/62">{{ formatarHoras(r.minutosEstudados) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <h2 class="mb-4 mt-8 text-lg font-semibold text-slate-950 dark:text-white">Administração</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button type="button" class="panel-action surface-card rounded-2xl p-5 text-left">
            <h3 class="mb-1 font-semibold text-slate-950 dark:text-white">Registros de Sessões</h3>
            <p class="text-sm text-slate-600 dark:text-white/62">Consultar sessoes de todos os usuarios.</p>
          </button>
          <button type="button" class="panel-action surface-card rounded-2xl p-5 text-left">
            <h3 class="mb-1 font-semibold text-slate-950 dark:text-white">Gerenciar Usuários</h3>
            <p class="text-sm text-slate-600 dark:text-white/62">Visualizar usuarios do sistema.</p>
          </button>
        </div>
      </div>

      <div class="flex-shrink-0 lg:w-80">
        <div class="static-card status-panel surface-card rounded-[2rem] p-6 text-center lg:sticky lg:top-6">
          <p class="relative z-10 mb-1 text-4xl font-mono font-bold tracking-tight text-slate-950 dark:text-white">22:41:08</p>
          <p class="relative z-10 mb-5 text-sm text-slate-500 dark:text-white/42">domingo, 18 de maio de 2026</p>

          <div class="status-card status-card--green relative z-10 mb-4 rounded-2xl border border-indigo-200/80 bg-indigo-50/78 px-3 py-4 text-sm text-indigo-700 dark:border-indigo-400/24 dark:bg-indigo-500/[0.07] dark:text-indigo-200">
            <div class="text-2xl font-mono font-bold tracking-tight">01:42:13</div>
            <div class="mt-1 text-xs text-indigo-600 dark:text-indigo-200/80">Sessão aberta desde 20:58:00</div>
          </div>

          <div class="status-card status-card--indigo relative z-10 mb-4 rounded-2xl border border-fuchsia-200/80 bg-fuchsia-50/78 px-3 py-4 text-sm text-fuchsia-700 dark:border-fuchsia-400/24 dark:bg-fuchsia-500/[0.07] dark:text-fuchsia-200">
            Total: <span class="font-bold">19h 25min</span>
          </div>

          <div class="status-card status-card--orange relative z-10 mb-4 rounded-2xl border border-orange-200/80 bg-orange-50/78 px-3 py-4 text-sm text-orange-700 dark:border-orange-400/24 dark:bg-orange-500/[0.07] dark:text-orange-200">
            <div class="text-2xl font-bold">🔥 6 <span class="text-sm font-normal">dias seguidos</span></div>
            <div class="mt-1 text-xs text-orange-500 dark:text-orange-300/80">Recorde: 11 dias</div>
          </div>

          <p class="relative z-10 mt-2 text-xs leading-6 text-slate-500 dark:text-white/36">
            Sessões são registradas automaticamente ao entrar/sair de canais de voz no Discord.
          </p>
          <p class="relative z-10 mt-4 text-xs text-slate-500 dark:text-white/36">Olá, Preview User</p>
        </div>
      </div>
    </div>
  `,
})
export class PreviewDashboard {
  protected readonly registros: PreviewSession[] = [
    { id: 1, startedAt: '2026-05-18T18:12:00Z', endedAt: '2026-05-18T19:47:00Z', minutosEstudados: 95 },
    { id: 2, startedAt: '2026-05-17T20:05:00Z', endedAt: '2026-05-17T21:20:00Z', minutosEstudados: 75 },
    { id: 3, startedAt: '2026-05-16T19:32:00Z', endedAt: null, minutosEstudados: 32 },
  ];

  protected formatarHoras(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}min`;
  }
}
