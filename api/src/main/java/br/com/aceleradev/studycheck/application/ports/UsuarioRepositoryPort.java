package br.com.aceleradev.studycheck.application.ports;

import br.com.aceleradev.studycheck.domain.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepositoryPort {
    Optional<Usuario> buscarPorEmail(String email);
    Optional<Usuario> buscarPorId(Long id);
    Optional<Usuario> buscarPorDiscordId(String discordId);
    Usuario salvar(Usuario usuario);
    List<Usuario> listarTodos();
}
