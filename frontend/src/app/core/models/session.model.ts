export interface StudySessionResponse {
  id: number;
  usuarioId: number;
  nomeUsuario: string;
  email: string;
  startedAt: string;
  endedAt: string | null;
  minutosEstudados: number;
}

export interface SessionAbertaResponse {
  aberta: boolean;
  startedAt: string | null;
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  studiedToday: boolean;
  lastStudyDate: string | null;
}

export interface LeaderboardEntryResponse {
  posicao: number;
  nomeUsuario: string;
  avatarUrl: string | null;
  totalMinutos: number;
  currentStreak: number;
}
