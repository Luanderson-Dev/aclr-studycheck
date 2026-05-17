import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { UsuarioResponse } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Usuários</h1>
    <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow overflow-hidden">
      @if (carregando()) {
        <div class="p-6 text-center text-gray-500 dark:text-gray-400">Carregando...</div>
      } @else if (usuarios().length === 0) {
        <div class="p-6 text-center text-gray-500 dark:text-gray-400">Nenhum usuário cadastrado.</div>
      } @else {
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Perfil</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            @for (u of usuarios(); track u.id) {
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ u.nome }}</td>
                <td class="px-6 py-4">
                  <span
                    class="px-2 py-1 text-xs rounded-full"
                    [class]="u.role === 'MOD' ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'"
                  >{{ u.role }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class Usuarios implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  readonly usuarios = signal<UsuarioResponse[]>([]);
  readonly carregando = signal(true);

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }
}
