package br.com.aceleradev.studycheck.domain;

import java.time.Instant;

public class RefreshToken {
    private Long id;
    private String token;
    private Long usuarioId;
    private Instant criadoEm;
    private Instant expiraEm;
    private boolean revogado;

    public RefreshToken() {}

    public RefreshToken(String token, Long usuarioId, Instant criadoEm, Instant expiraEm) {
        this.token = token;
        this.usuarioId = usuarioId;
        this.criadoEm = criadoEm;
        this.expiraEm = expiraEm;
        this.revogado = false;
    }

    public boolean estaExpirado() {
        return Instant.now().isAfter(this.expiraEm);
    }

    public boolean estaValido() {
        return !this.revogado && !estaExpirado();
    }

    public void revogar() {
        this.revogado = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Instant getCriadoEm() { return criadoEm; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }

    public Instant getExpiraEm() { return expiraEm; }
    public void setExpiraEm(Instant expiraEm) { this.expiraEm = expiraEm; }

    public boolean isRevogado() { return revogado; }
    public void setRevogado(boolean revogado) { this.revogado = revogado; }
}
