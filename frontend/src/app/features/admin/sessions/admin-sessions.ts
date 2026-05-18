import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../core/services/session.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { StudySessionResponse } from '../../../core/models/session.model';
import { UsuarioResponse } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-admin-sessions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe],
  template: `
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Registros de Sessões</h1>

    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuário</label>
          <select [(ngModel)]="usuarioSelecionado"
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option [ngValue]="null">Selecione...</option>
            @for (u of usuarios(); track u.id) {
              <option [ngValue]="u.id">{{ u.nome }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início</label>
          <input type="date" [(ngModel)]="dataInicio"
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Fim</label>
          <input type="date" [(ngModel)]="dataFim"
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button (click)="buscar()"
          [disabled]="!usuarioSelecionado || !dataInicio || !dataFim || buscando()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
          @if (buscando()) { Buscando... } @else { Buscar }
        </button>
      </div>
    </div>

    @if (erro()) {
      <div class="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4 text-sm">{{ erro() }}</div>
    }

    @if (buscou()) {
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200">Resultados</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ registros().length }} registro(s) — Total: {{ totalHoras() }}</span>
        </div>
        @if (registros().length === 0) {
          <div class="p-6 text-center text-gray-500 dark:text-gray-400">Nenhum registro no período.</div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-[52rem] w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuário</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Início</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fim</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tempo</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                @for (r of registros(); track r.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">{{ r.nomeUsuario }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ r.startedAt | date:'dd/MM/yyyy' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ r.startedAt | date:'HH:mm:ss' }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      @if (r.endedAt) { {{ r.endedAt | date:'HH:mm:ss' }} }
                      @else { <span class="text-yellow-600 dark:text-yellow-400 font-medium">Em aberto</span> }
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      @if (r.minutosEstudados > 0) { {{ formatarHoras(r.minutosEstudados) }} }
                      @else { — }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
})
export class AdminSessions implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly usuarioService = inject(UsuarioService);

  readonly usuarios = signal<UsuarioResponse[]>([]);
  readonly registros = signal<StudySessionResponse[]>([]);
  readonly buscando = signal(false);
  readonly buscou = signal(false);
  readonly erro = signal('');

  usuarioSelecionado: number | null = null;
  dataInicio = '';
  dataFim = '';

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => this.usuarios.set(usuarios),
    });
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    this.dataInicio = this.formatarData(inicioMes);
    this.dataFim = this.formatarData(hoje);
  }

  buscar(): void {
    if (!this.usuarioSelecionado || !this.dataInicio || !this.dataFim) return;
    this.buscando.set(true);
    this.erro.set('');
    this.sessionService.listarAdmin(this.usuarioSelecionado, this.dataInicio, this.dataFim).subscribe({
      next: (registros) => {
        this.registros.set(registros);
        this.buscando.set(false);
        this.buscou.set(true);
      },
      error: (err) => {
        this.erro.set(err.error?.detail || 'Erro ao buscar registros.');
        this.buscando.set(false);
      },
    });
  }

  formatarHoras(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}min`;
  }

  totalHoras(): string {
    return this.formatarHoras(this.registros().reduce((acc, r) => acc + r.minutosEstudados, 0));
  }

  private formatarData(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}
