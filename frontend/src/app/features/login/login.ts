import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeToggle } from '../../core/components/theme-toggle';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThemeToggle],
  styles: [`
    :host {
      display: block;
    }

    @keyframes revealGlow {
      0% {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
        filter: blur(8px);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
      }
    }

    @keyframes buttonIgnite {
      0%, 100% {
        transform: translateY(0) scale(1);
        border-color: rgba(148, 163, 184, 0.45);
        box-shadow: none;
        background:
          linear-gradient(rgba(15, 23, 42, 1), rgba(15, 23, 42, 1)) padding-box,
          linear-gradient(120deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.35)) border-box;
      }
      35% {
        transform: translateY(-1px) scale(1.015);
        border-color: transparent;
        box-shadow: 0 12px 30px rgba(255, 128, 47, 0.16);
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.08)) padding-box,
          linear-gradient(120deg, rgba(255, 128, 47, 0.95), rgba(255, 59, 48, 0.9), rgba(217, 70, 239, 0.88)) border-box;
      }
    }

    @keyframes buttonIgniteDark {
      0%, 100% {
        transform: translateY(0) scale(1);
        border-color: rgba(255, 255, 255, 0.12);
        box-shadow: none;
        background:
          linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)) padding-box,
          linear-gradient(120deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)) border-box;
      }
      35% {
        transform: translateY(-1px) scale(1.015);
        border-color: transparent;
        box-shadow: 0 12px 30px rgba(255, 128, 47, 0.16);
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.08)) padding-box,
          linear-gradient(120deg, rgba(255, 128, 47, 0.95), rgba(255, 59, 48, 0.9), rgba(217, 70, 239, 0.88)) border-box;
      }
    }

    @keyframes pillIgniteAmber {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
        border-color: rgba(226, 232, 240, 0.9);
        color: rgb(100 116 139);
        box-shadow: none;
      }
      35% {
        transform: translateY(-2px) scale(1.04);
        border-color: rgb(252 211 77 / 1);
        color: rgb(30 41 59 / 1);
        box-shadow: 0 0 0 1px rgba(252, 211, 77, 0.3);
      }
    }

    @keyframes pillIgniteViolet {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
        border-color: rgba(226, 232, 240, 0.9);
        color: rgb(100 116 139);
        box-shadow: none;
      }
      35% {
        transform: translateY(-2px) scale(1.04);
        border-color: rgb(196 181 253 / 1);
        color: rgb(30 41 59 / 1);
        box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.3);
      }
    }

    @keyframes pillIgniteOrange {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
        border-color: rgba(226, 232, 240, 0.9);
        color: rgb(100 116 139);
        box-shadow: none;
      }
      35% {
        transform: translateY(-2px) scale(1.04);
        border-color: rgb(251 146 60 / 1);
        color: rgb(30 41 59 / 1);
        box-shadow: 0 0 0 1px rgba(251, 146, 60, 0.32);
      }
    }

    .focus-scene {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      background:
        radial-gradient(ellipse at 14% 100%, rgba(255, 126, 46, 0.72), transparent 38%),
        radial-gradient(ellipse at 48% 96%, rgba(255, 59, 48, 0.58), transparent 34%),
        radial-gradient(ellipse at 84% 92%, rgba(217, 70, 239, 0.5), transparent 30%),
        radial-gradient(ellipse at 78% 10%, rgba(99, 102, 241, 0.24), transparent 26%),
        linear-gradient(180deg, #fbfcff 0%, #edf2ff 40%, #f8f9ff 100%);
      transition:background 220ms ease;
    }

    :host-context(.dark) .focus-scene {
      background:
        radial-gradient(ellipse at 12% 100%, rgba(255, 128, 47, 0.68), transparent 36%),
        radial-gradient(ellipse at 42% 96%, rgba(255, 59, 48, 0.62), transparent 32%),
        radial-gradient(ellipse at 82% 92%, rgba(217, 70, 239, 0.52), transparent 28%),
        radial-gradient(ellipse at 70% 78%, rgba(124, 58, 237, 0.18), transparent 22%),
        linear-gradient(180deg, #060709 0%, #0a0b10 42%, #09070b 100%);
    }

    .focus-scene::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 88%, rgba(255, 237, 178, 0.5), transparent 14%),
        radial-gradient(ellipse at 42% 84%, rgba(255, 168, 76, 0.3), transparent 16%),
        radial-gradient(ellipse at 84% 88%, rgba(244, 114, 182, 0.28), transparent 18%),
        radial-gradient(ellipse at 14% 14%, rgba(255, 255, 255, 0.82), transparent 18%);
      filter: blur(52px);
      opacity: 1;
      pointer-events: none;
    }

    :host-context(.dark) .focus-scene::before {
      background:
        radial-gradient(ellipse at 18% 88%, rgba(255, 184, 76, 0.3), transparent 15%),
        radial-gradient(ellipse at 42% 82%, rgba(255, 59, 48, 0.18), transparent 18%),
        radial-gradient(ellipse at 86% 86%, rgba(217, 70, 239, 0.24), transparent 20%);
    }

    .noise-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity:.04;
      mix-blend-mode: soft-light;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    }

    .ambient-streak {
      position: absolute;
      border-radius: 9999px;
      filter: blur(18px);
      opacity: 0.52;
      pointer-events: none;
    }

    .login-card {
      transition:
        transform 160ms ease,
        border-color 160ms ease,
        background-color 160ms ease;
    }

    .login-card:hover {
      transform: translateY(-1px);
    }

    .login-button {
      border-color: transparent;
      background:
        linear-gradient(rgba(15, 23, 42, 1), rgba(15, 23, 42, 1)) padding-box,
        linear-gradient(120deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.35)) border-box;
      transition:
        transform 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        box-shadow 160ms ease;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px) scale(1.018);
      box-shadow: 0 12px 30px rgba(255, 128, 47, 0.16);
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.08)) padding-box,
        linear-gradient(120deg, rgba(255, 128, 47, 0.95), rgba(255, 59, 48, 0.9), rgba(217, 70, 239, 0.88)) border-box;
    }

    :host-context(.dark) .login-button:hover:not(:disabled) {
      box-shadow: 0 12px 30px rgba(255, 128, 47, 0.16);
      background:
        linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.08)) padding-box,
        linear-gradient(120deg, rgba(255, 128, 47, 0.95), rgba(255, 59, 48, 0.9), rgba(217, 70, 239, 0.88)) border-box;
    }

    :host-context(.dark) .login-button {
      background:
        linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)) padding-box,
        linear-gradient(120deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)) border-box;
    }

    .intro-ignite-button {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) 380ms forwards,
        buttonIgnite 1400ms ease-in-out 1800ms 1 both;
    }

    :host-context(.dark) .intro-ignite-button {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) 380ms forwards,
        buttonIgniteDark 1400ms ease-in-out 1800ms 1 both;
    }

    .feature-pill {
      cursor: default;
      user-select: none;
      transition:
        transform 180ms ease,
        background-color 180ms ease,
        border-color 180ms ease,
        color 180ms ease,
        box-shadow 180ms ease;
    }

    .intro-ignite-rank {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
        pillIgniteAmber 1200ms ease-in-out 420ms 1 both;
    }

    .intro-ignite-time {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) 140ms forwards,
        pillIgniteViolet 1200ms ease-in-out 920ms 1 both;
    }

    .intro-ignite-streak {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) 260ms forwards,
        pillIgniteOrange 1200ms ease-in-out 1420ms 1 both;
    }

    @keyframes pillIgniteAmberDark {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
        border-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.44);
        box-shadow: none;
      }
      35% {
        transform: translateY(-2px) scale(1.04);
        border-color: rgba(252, 211, 77, 0.7);
        color: white;
        box-shadow: 0 0 0 1px rgba(252, 211, 77, 0.28);
      }
    }

    @keyframes pillIgniteVioletDark {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
        border-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.44);
        box-shadow: none;
      }
      35% {
        transform: translateY(-2px) scale(1.04);
        border-color: rgba(196, 181, 253, 0.7);
        color: white;
        box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.28);
      }
    }

    @keyframes pillIgniteOrangeDark {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 1;
        border-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.44);
        box-shadow: none;
      }
      35% {
        transform: translateY(-2px) scale(1.04);
        border-color: rgba(251, 146, 60, 0.75);
        color: white;
        box-shadow: 0 0 0 1px rgba(251, 146, 60, 0.3);
      }
    }

    :host-context(.dark) .intro-ignite-rank {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
        pillIgniteAmberDark 1200ms ease-in-out 420ms 1 both;
    }

    :host-context(.dark) .intro-ignite-time {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) 140ms forwards,
        pillIgniteVioletDark 1200ms ease-in-out 920ms 1 both;
    }

    :host-context(.dark) .intro-ignite-streak {
      animation:
        revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) 260ms forwards,
        pillIgniteOrangeDark 1200ms ease-in-out 1420ms 1 both;
    }

    .feature-rank:hover,
    .feature-rank:focus-visible {
      transform: translateY(-1px) scale(1.03) !important;
      border-color: rgb(252 211 77 / 1) !important;
      color: rgb(30 41 59 / 1) !important;
      box-shadow: 0 0 0 1px rgba(252, 211, 77, 0.3) !important;
    }

    .feature-time:hover,
    .feature-time:focus-visible {
      transform: translateY(-1px) scale(1.03) !important;
      border-color: rgb(196 181 253 / 1) !important;
      color: rgb(30 41 59 / 1) !important;
      box-shadow: 0 0 0 1px rgba(167, 139, 250, 0.3) !important;
    }

    .feature-streak:hover,
    .feature-streak:focus-visible {
      transform: translateY(-1px) scale(1.03) !important;
      border-color: rgb(251 146 60 / 1) !important;
      color: rgb(30 41 59 / 1) !important;
      box-shadow: 0 0 0 1px rgba(251, 146, 60, 0.32) !important;
    }

    :host-context(.dark) .feature-rank:hover,
    :host-context(.dark) .feature-rank:focus-visible,
    :host-context(.dark) .feature-time:hover,
    :host-context(.dark) .feature-time:focus-visible,
    :host-context(.dark) .feature-streak:hover,
    :host-context(.dark) .feature-streak:focus-visible {
      color: white !important;
    }

    .intro-reveal {
      opacity: 0;
      animation: revealGlow 680ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .intro-delay-1 {
      animation-delay: 80ms;
    }

    .intro-delay-2 {
      animation-delay: 180ms;
    }

  `],
  template: `
    <div class="focus-scene flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
      <div class="noise-overlay"></div>
      <div class="absolute top-4 right-4 z-10">
        <app-theme-toggle />
      </div>

      <div class="ambient-streak left-[8%] top-[10%] h-20 w-48 rotate-[-8deg] bg-indigo-400/14 dark:bg-white/4 sm:h-24 sm:w-72"></div>
      <div class="ambient-streak left-[2%] bottom-[10%] h-24 w-44 rotate-[18deg] bg-orange-400/24 dark:bg-orange-500/18 sm:left-[8%] sm:h-28 sm:w-64"></div>
      <div class="ambient-streak right-[4%] bottom-[8%] h-24 w-48 rotate-[-12deg] bg-fuchsia-400/18 dark:bg-fuchsia-500/16 sm:right-[10%] sm:h-28 sm:w-72"></div>

      <div class="relative z-10 w-full max-w-md">
        <div class="login-card rounded-[18px] border border-slate-200/95 bg-white/80 p-6 backdrop-blur-md dark:border-white/10 dark:bg-black/24 sm:p-8 md:p-9">
          <div class="mb-7 flex flex-col items-center pt-3 text-center sm:mb-8 sm:pt-4">
            <div class="intro-reveal mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/88 ring-1 ring-slate-200/90 dark:bg-white/6 dark:ring-white/10 sm:mb-5 sm:h-12 sm:w-12">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="text-slate-800 dark:text-white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.42a12 12 0 0 1 .84 4.42c0 1.42-.34 2.76-.94 3.94" />
                <path d="M12 14v7M5.5 11.5v4.5c0 1.1 2.9 3 6.5 3s6.5-1.9 6.5-3v-4.5" />
              </svg>
            </div>
            <h1 class="intro-reveal intro-delay-1 max-w-xs text-balance text-[2rem] font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              StudyCheck
            </h1>
            <p class="intro-reveal intro-delay-2 mt-3 max-w-sm text-pretty text-[15px] leading-7 text-slate-700 dark:text-white/58 sm:mt-4 sm:text-base">
              Entrou na call de estudos do <span class="font-semibold text-slate-900 dark:text-white">AceleraDev</span>?
              <br />
              O <span class="font-semibold text-slate-900 dark:text-white">StudyCheck</span> acompanha seu tempo, mantém sua ofensiva
              e mostra sua evolução com clareza.
            </p>
          </div>

          <div class="mb-7 flex flex-wrap justify-center gap-2 text-xs sm:mb-8 sm:text-sm">
            <span [class.intro-ignite-rank]="pillIntroActive()" class="feature-pill feature-rank rounded-full border border-slate-200/90 bg-white/72 px-3 py-1.5 font-medium text-slate-500 backdrop-blur dark:border-white/8 dark:bg-white/[0.03] dark:text-white/44">🏆 Ranking ativo</span>
            <span [class.intro-ignite-time]="pillIntroActive()" class="feature-pill feature-time rounded-full border border-slate-200/90 bg-white/72 px-3 py-1.5 font-medium text-slate-500 backdrop-blur dark:border-white/8 dark:bg-white/[0.03] dark:text-white/44">⏱️ Tempo em foco</span>
            <span [class.intro-ignite-streak]="pillIntroActive()" class="feature-pill feature-streak rounded-full border border-slate-200/90 bg-white/72 px-3 py-1.5 font-medium text-slate-500 backdrop-blur dark:border-white/8 dark:bg-white/[0.03] dark:text-white/44">🔥 Sequência viva</span>
          </div>

          @if (erro()) {
            <div class="mb-4 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700 backdrop-blur dark:border-red-300/20 dark:bg-red-500/8 dark:text-red-100">
              {{ erro() }}
            </div>
          }

          <button
            type="button"
            (click)="entrarComDiscord()"
            [disabled]="carregando()"
            [class.intro-ignite-button]="pillIntroActive()"
            class="login-button flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border border-transparent px-4 py-3 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] sm:py-3.5 sm:text-base"
          >
            <svg width="22" height="17" viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            @if (carregando()) { Entrando... } @else { Entrar com Discord }
          </button>

          <p class="mx-auto mt-5 max-w-xs text-center text-xs leading-6 text-slate-600 dark:text-white/42 sm:mt-6 sm:text-sm">
            Exclusivo pra quem é do <span class="font-semibold text-slate-700 dark:text-white/70">Discord do AceleraDev</span>.
            Bora subir nesse ranking? 💪
          </p>
        </div>
      </div>
    </div>
  `,
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly themeService = inject(ThemeService);
  readonly erro = signal('');
  readonly carregando = signal(false);
  readonly pillIntroActive = signal(true);
  private themeAnimationInitialized = false;
  private introAnimationTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.restartIntroAnimations();
    effect(() => {
      this.themeService.theme();
      if (!this.themeAnimationInitialized) {
        this.themeAnimationInitialized = true;
        return;
      }
      this.restartIntroAnimations();
    });
  }

  private restartIntroAnimations(): void {
    if (this.introAnimationTimeout) {
      clearTimeout(this.introAnimationTimeout);
    }
    this.pillIntroActive.set(false);
    setTimeout(() => this.pillIntroActive.set(true), 20);
    this.introAnimationTimeout = setTimeout(() => {
      this.pillIntroActive.set(false);
      this.introAnimationTimeout = null;
    }, 3400);
  }

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
