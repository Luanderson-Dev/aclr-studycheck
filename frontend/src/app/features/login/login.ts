import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeToggle } from '../../core/components/theme-toggle';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggle],
  styles: [`
    :host { display: block; }

    .scene {
      position: relative;
      height: 100vh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background:
        radial-gradient(circle at 84% 88%, var(--app-bg-soft), transparent 26%),
        radial-gradient(circle at 92% 94%, var(--app-bg-soft), transparent 28%),
        var(--app-bg);
    }

    .glow {
      position: absolute;
      border-radius: 9999px;
      filter: blur(80px);
      pointer-events: none;
      background: var(--app-accent-soft);
    }

    .cta {
      transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
    }
    .cta:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 16px 38px var(--app-accent-soft);
    }
    .cta:active { transform: translateY(0); }

    .step-card {
      transition: transform 200ms ease, border-color 200ms ease, background-color 200ms ease;
    }
    .step-card:hover {
      transform: translateY(-3px);
      border-color: var(--app-accent-border);
      background: var(--app-accent-soft);
    }

    @keyframes rise {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .rise { opacity: 0; animation: rise 720ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
    .d1 { animation-delay: 80ms; }
    .d2 { animation-delay: 170ms; }
    .d3 { animation-delay: 260ms; }
    .d4 { animation-delay: 360ms; }
    .d5 { animation-delay: 460ms; }
  `],
  template: `
    <div class="scene text-app">
      <div class="glow right-[-6rem] bottom-[-6rem] h-80 w-80"></div>
      <div class="glow left-[10%] top-[6%] h-40 w-72"></div>

      <div class="absolute right-4 top-4 z-20">
        <app-theme-toggle />
      </div>

      <main class="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center overflow-hidden px-6 py-8 text-center">
        <div class="rise d1 mb-6 flex items-center gap-2 rounded-full border border-app bg-surface px-4 py-1.5 text-xs text-muted">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
          parte da comunidade <span class="font-medium text-accent">AceleraDev</span>
        </div>

        <h1 class="rise d2 max-w-2xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-heading sm:text-5xl">
          O foco virou <span class="italic text-accent">número</span>.
          <br />
          O número virou ranking.
        </h1>

        <p class="rise d3 mt-5 max-w-xl text-pretty text-[15px] leading-7 text-muted">
          Entrou na call de estudo do <span class="text-heading">AceleraDev</span> no Discord?
          O StudyCheck conta o tempo, segura sua ofensiva e mostra sua posição na semana.
          Você não clica em nada.
        </p>

        @if (erro()) {
          <div class="rise mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-200">
            {{ erro() }}
          </div>
        }

        <div class="rise d4 mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            (click)="entrarComDiscord()"
            [disabled]="carregando()"
            class="cta flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="20" height="15" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            @if (carregando()) { Entrando... } @else { Entrar com Discord }
          </button>
        </div>

        <div class="rise d5 mt-10 grid w-full gap-3 border-t border-app-soft pt-8 text-left sm:grid-cols-3">
          @for (st of steps; track st.tag) {
            <div class="step-card rounded-xl border border-app bg-surface p-4">
              <p class="font-mono text-xs uppercase tracking-[0.18em] text-accent">{{ st.tag }}</p>
              <h3 class="mt-2 font-semibold text-heading">{{ st.title }}</h3>
              <p class="mt-1 text-sm leading-6 text-muted">{{ st.desc }}</p>
            </div>
          }
        </div>
      </main>

      <footer class="relative z-10 mx-auto flex w-full max-w-6xl flex-shrink-0 flex-col items-center justify-between gap-2 border-t border-app-soft px-6 py-4 text-xs text-faint sm:flex-row sm:px-8">
        <span>© 2026 StudyCheck · feito por
          <a
            href="https://github.com/Luanderson-Dev"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-medium text-muted transition-colors hover:text-accent"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/>
            </svg>
            Luanderson-Dev
          </a>
        </span>
        <span class="font-mono">v0.4.0 · não-oficial</span>
      </footer>
    </div>
  `,
})
export class Login {
  private readonly http = inject(HttpClient);
  readonly erro = signal('');
  readonly carregando = signal(false);

  protected readonly steps = [
    { tag: 'step 01', title: 'Entra na call', desc: 'A sessão começa sozinha, sem comando e sem botão.' },
    { tag: 'step 02', title: 'Estuda', desc: 'Cronômetro contínuo, em silêncio, no canto da tela.' },
    { tag: 'step 03', title: 'Sai e pronto', desc: 'Tempo, ofensiva e ranking atualizam automaticamente.' },
  ];

  entrarComDiscord(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.http.get<{ url: string }>('/auth/discord/url').subscribe({
      next: (res) => (window.location.href = res.url),
      error: () => {
        this.carregando.set(false);
        this.erro.set('Erro ao iniciar autenticação com Discord.');
      },
    });
  }
}
