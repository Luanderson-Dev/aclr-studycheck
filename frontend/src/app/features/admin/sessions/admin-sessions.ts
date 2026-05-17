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
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Registros de Sessões</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
          <select [(ngModel)]="usuarioSelecionado"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option [ngValue]="null">Selecione...</option>
            @for (u of usuarios(); track u.id) {
              <option [ngValue]="u.id">{{ u.nome }}</option>
            }
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
          <input type="date" [(ngModel)]="dataInicio"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
          <input type="date" [(ngModel)]="dataFim"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button (click)="buscar()"
          [disabled]="!usuarioSelecionado || !dataInicio || !dataFim || buscando()"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
          @if (buscando()) { Buscando... } @else { Buscar }
        </button>
      </div>
    </div>

    @if (erro()) {
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{{ erro() }}</div>
    }

    @if (buscou()) {
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-700">Resultados</h2>
          <span class="text-sm text-gray-500">{{ registros().length }} registro(s) — Total: {{ totalHoras() }}</span>
        </div>
        @if (registros().length === 0) {
          <div class="p-6 text-center text-gray-500">Nenhum registro no período.</div>
        } @else {
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Início</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fim</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tempo</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (r of registros(); track r.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ r.nomeUsuario }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ r.startedAt | date:'dd/MM/yyyy' }}</td>
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
