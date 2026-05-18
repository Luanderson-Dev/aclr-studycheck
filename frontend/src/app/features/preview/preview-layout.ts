import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeToggle } from '../../core/components/theme-toggle';

@Component({
  selector: 'app-preview-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggle],
  styles: [`
    :host {
      display: block;
      color: #0f172a;
    }

    .preview-link {
      cursor: pointer;
      transition:
        transform 160ms ease,
        color 160ms ease,
        border-color 160ms ease,
        background-color 160ms ease,
        box-shadow 160ms ease;
    }

    .preview-link:hover {
      transform: translateY(-1px) scale(1.02);
    }

    .preview-shell {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(circle at 84% 88%, rgba(255, 164, 85, 0.24), transparent 20%),
        radial-gradient(circle at 92% 92%, rgba(251, 113, 133, 0.2), transparent 22%),
        radial-gradient(circle at 96% 90%, rgba(99, 102, 241, 0.18), transparent 20%),
        radial-gradient(circle at 88% 80%, rgba(59, 130, 246, 0.16), transparent 18%),
        radial-gradient(circle at 72% 12%, rgba(191, 219, 254, 0.22), transparent 16%),
        linear-gradient(180deg, #fcfdff 0%, #f5f7ff 50%, #f8fafc 100%);
    }

    :host-context(.dark) .preview-shell {
      background:
        radial-gradient(circle at 84% 88%, rgba(255, 124, 47, 0.26), transparent 18%),
        radial-gradient(circle at 90% 92%, rgba(255, 59, 48, 0.22), transparent 22%),
        radial-gradient(circle at 96% 94%, rgba(217, 70, 239, 0.2), transparent 20%),
        radial-gradient(circle at 88% 84%, rgba(99, 102, 241, 0.12), transparent 18%),
        linear-gradient(180deg, #020304 0%, #050608 48%, #030405 100%);
    }

    .preview-shell::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 88% 92%, rgba(255, 154, 65, 0.16), transparent 14%),
        radial-gradient(circle at 96% 88%, rgba(244, 114, 182, 0.14), transparent 16%),
        radial-gradient(circle at 84% 80%, rgba(129, 140, 248, 0.14), transparent 14%);
      filter: blur(42px);
    }

    :host-context(.dark) .preview-shell::before {
      background:
        radial-gradient(circle at 18% 88%, rgba(255, 184, 76, 0.18), transparent 11%),
        radial-gradient(circle at 86% 86%, rgba(217, 70, 239, 0.14), transparent 12%);
    }

    .preview-nav {
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(248, 250, 252, 0.72));
      backdrop-filter: blur(16px);
      box-shadow: 0 14px 36px rgba(148, 163, 184, 0.14);
    }

    :host-context(.dark) .preview-nav {
      border-bottom-color: rgba(255, 255, 255, 0.06);
      background: rgba(0, 0, 0, 0.22);
      box-shadow: none;
    }

    .preview-scroll {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .preview-scroll::-webkit-scrollbar {
      display: none;
    }
  `],
  template: `
    <div class="preview-shell">
      <div class="pointer-events-none absolute left-[10%] top-[12%] h-16 w-32 rounded-full bg-sky-300/18 blur-2xl dark:bg-indigo-500/10"></div>
      <div class="pointer-events-none absolute bottom-[-4rem] right-[-3rem] h-56 w-56 rounded-full bg-orange-300/28 blur-3xl dark:bg-orange-500/20"></div>
      <div class="pointer-events-none absolute bottom-[-5rem] right-[8%] h-64 w-64 rounded-full bg-rose-300/24 blur-3xl dark:bg-red-500/18"></div>
      <div class="pointer-events-none absolute bottom-[-4rem] right-[-2rem] h-72 w-72 rounded-full bg-indigo-300/24 blur-3xl dark:bg-fuchsia-500/18"></div>

      <nav class="preview-nav relative z-10">
        <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div class="flex min-w-0 flex-col gap-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xl font-bold text-slate-900 dark:text-white">StudyCheck</p>
                <p class="text-xs tracking-[0.18em] text-slate-500 dark:text-white/42">PREVIEW DE INTERFACE</p>
              </div>
              <div class="lg:hidden">
                <app-theme-toggle />
              </div>
            </div>
            <div class="preview-scroll overflow-x-auto pb-1">
              <div class="flex min-w-max items-center gap-5">
                <a
                  routerLink="/preview"
                  routerLinkActive="border-orange-300 bg-white/85 text-slate-900 shadow-[0_10px_24px_rgba(148,163,184,0.14)] dark:bg-white/8 dark:text-white dark:shadow-none"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="preview-link whitespace-nowrap rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-500 hover:border-slate-200 hover:bg-white/80 hover:text-slate-900 dark:text-white/54 dark:hover:border-white/10 dark:hover:bg-white/6 dark:hover:text-white"
                >Dashboard</a>
                <a
                  routerLink="/preview/leaderboard"
                  routerLinkActive="border-orange-300 bg-white/85 text-slate-900 shadow-[0_10px_24px_rgba(148,163,184,0.14)] dark:bg-white/8 dark:text-white dark:shadow-none"
                  class="preview-link whitespace-nowrap rounded-full border border-transparent px-3 py-2 text-sm font-medium text-slate-500 hover:border-slate-200 hover:bg-white/80 hover:text-slate-900 dark:text-white/54 dark:hover:border-white/10 dark:hover:bg-white/6 dark:hover:text-white"
                >Leaderboard</a>
              </div>
            </div>
          </div>
          <div class="hidden items-center gap-4 lg:flex">
            <span class="whitespace-nowrap text-sm text-slate-600 dark:text-white/72">
              Preview User
              <span class="ml-1 rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 text-xs text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-white">
                MOD
              </span>
            </span>
            <app-theme-toggle />
          </div>
        </div>
      </nav>

      <main class="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class PreviewLayout {}
