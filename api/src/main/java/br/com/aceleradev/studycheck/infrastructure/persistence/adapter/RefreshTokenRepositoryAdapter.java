package br.com.aceleradev.studycheck.infrastructure.persistence.adapter;

import br.com.aceleradev.studycheck.application.ports.RefreshTokenRepositoryPort;
import br.com.aceleradev.studycheck.domain.RefreshToken;
import br.com.aceleradev.studycheck.infrastructure.persistence.mapper.RefreshTokenMapper;
import br.com.aceleradev.studycheck.infrastructure.persistence.repository.SpringRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RefreshTokenRepositoryAdapter implements RefreshTokenRepositoryPort {
    private final SpringRefreshTokenRepository repository;
    private final RefreshTokenMapper mapper;

    @Override
    public RefreshToken salvar(RefreshToken refreshToken) {
        return mapper.toDomain(repository.save(mapper.toEntity(refreshToken)));
    }

    @Override
    public Optional<RefreshToken> buscarPorToken(String token) {
        return repository.findByToken(token).map(mapper::toDomain);
    }

    @Override
    @Transactional
    public void revogarTodosPorUsuarioId(Long usuarioId) {
        repository.revogarTodosPorUsuarioId(usuarioId);
    }
}
