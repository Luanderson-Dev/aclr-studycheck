import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { LoginResponse, UsuarioLogado } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly accessToken = signal<string | null>(null);
  private readonly usuario = signal<UsuarioLogado | null>(null);
  private _inicializado = false;
  private _inicializandoPromise: Promise<boolean> | null = null;

  readonly estaAutenticado = computed(() => !!this.accessToken());
  readonly usuarioLogado = computed(() => this.usuario());

  getAccessToken(): string | null {
    return this.accessToken();
  }

  get inicializado(): boolean {
    return this._inicializado;
  }

  inicializar(): Promise<boolean> {
    if (this._inicializado) return Promise.resolve(this.estaAutenticado());
    if (this._inicializandoPromise) return this._inicializandoPromise;

    this._inicializandoPromise = new Promise<boolean>((resolve) => {
      this.http
        .post<LoginResponse>(`/auth/refresh`, null, { withCredentials: true })
        .pipe(
          tap((res) => this.definirSessao(res)),
          catchError(() => of(null)),
        )
        .subscribe({
          next: (res) => {
            this._inicializado = true;
            this._inicializandoPromise = null;
            resolve(!!res);
          },
          error: () => {
            this._inicializado = true;
            this._inicializandoPromise = null;
            resolve(false);
          },
        });
    });

    return this._inicializandoPromise;
  }

  loginComDiscord(code: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`/auth/discord/token`, null, {
        params: { code },
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          this.definirSessao(res);
          this._inicializado = true;
        }),
      );
  }

  refresh(): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`/auth/refresh`, null, { withCredentials: true })
      .pipe(tap((res) => this.definirSessao(res)));
  }

  logout(): void {
    this.http.post(`/auth/logout`, null, { withCredentials: true }).subscribe({
      complete: () => this.limparSessao(),
      error: () => this.limparSessao(),
    });
  }

  private definirSessao(res: LoginResponse): void {
    this.accessToken.set(res.accessToken);
    this.usuario.set({ nome: res.nomeUsuario, email: res.email, role: res.role });
  }

  private limparSessao(): void {
    this.accessToken.set(null);
    this.usuario.set(null);
    this.router.navigate(['/login']);
  }
}
