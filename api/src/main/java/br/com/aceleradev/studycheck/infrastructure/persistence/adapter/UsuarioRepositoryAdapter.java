package br.com.aceleradev.studycheck.infrastructure.persistence.adapter;

import br.com.aceleradev.studycheck.application.ports.UsuarioRepositoryPort;
import br.com.aceleradev.studycheck.domain.Usuario;
import br.com.aceleradev.studycheck.infrastructure.persistence.mapper.UsuarioMapper;
import br.com.aceleradev.studycheck.infrastructure.persistence.repository.SpringUsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {
    private final SpringUsuarioRepository repository;
    private final UsuarioMapper mapper;

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repository.findByEmail(email).map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorDiscordId(String discordId) {
        return repository.findByDiscordId(discordId).map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Usuario salvar(Usuario usuario) {
        return mapper.toDomain(repository.save(mapper.toEntity(usuario)));
    }

    @Override
    public List<Usuario> listarTodos() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }
}
