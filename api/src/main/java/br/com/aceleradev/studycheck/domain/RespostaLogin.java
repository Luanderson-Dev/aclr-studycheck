package br.com.aceleradev.studycheck.domain;

public class RespostaLogin {
    private final String accessToken;
    private final String refreshToken;
    private final String nomeUsuario;
    private final String email;
    private final String role;

    public RespostaLogin(String accessToken, String refreshToken, String nomeUsuario, String email, String role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.role = role;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getNomeUsuario() { return nomeUsuario; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
