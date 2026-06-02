import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaderboardEntryResponse, SessionAbertaResponse, StreakResponse, StudySessionResponse } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/sessions';

  streak(): Observable<StreakResponse> {
    return this.http.get<StreakResponse>(`${this.apiUrl}/streak`);
  }

  verificarAberta(): Observable<SessionAbertaResponse> {
    return this.http.get<SessionAbertaResponse>(`${this.apiUrl}/aberta`);
  }

  listarMinhas(): Observable<StudySessionResponse[]> {
    return this.http.get<StudySessionResponse[]>(`${this.apiUrl}/minhas`);
  }

  listarLeaderboard(ano?: number, mes?: number): Observable<LeaderboardEntryResponse[]> {
    let params = new HttpParams();
    if (ano !== undefined) params = params.set('ano', ano);
    if (mes !== undefined) params = params.set('mes', mes);
    return this.http.get<LeaderboardEntryResponse[]>(`${this.apiUrl}/leaderboard`, { params });
  }

  listarAdmin(usuarioId: number, dataInicio: string, dataFim: string): Observable<StudySessionResponse[]> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);
    return this.http.get<StudySessionResponse[]>(`${this.apiUrl}/admin`, { params });
  }

  iniciar(): Observable<StudySessionResponse> {
    return this.http.post<StudySessionResponse>(`${this.apiUrl}/start`, null);
  }

  encerrar(): Observable<StudySessionResponse> {
    return this.http.post<StudySessionResponse>(`${this.apiUrl}/stop`, null);
  }
}
