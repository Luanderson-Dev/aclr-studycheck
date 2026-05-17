package br.com.aceleradev.studycheck.application.ports;

import br.com.aceleradev.studycheck.domain.RefreshToken;

import java.util.Optional;

public interface RefreshTokenRepositoryPort {
    RefreshToken salvar(RefreshToken refreshToken);
    Optional<RefreshToken> buscarPorToken(String token);
    void revogarTodosPorUsuarioId(Long usuarioId);
}
