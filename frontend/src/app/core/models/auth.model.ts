export interface LoginResponse {
  accessToken: string;
  nomeUsuario: string;
  email: string;
  role: string;
}

export interface UsuarioLogado {
  nome: string;
  email: string;
  role: string;
}
