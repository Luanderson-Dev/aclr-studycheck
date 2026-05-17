package br.com.aceleradev.studycheck.infrastructure.persistence.repository;

public interface LeaderboardProjection {
    Long getUsuarioId();
    String getNomeUsuario();
    String getAvatarUrl();
    Long getTotalMinutos();
}
