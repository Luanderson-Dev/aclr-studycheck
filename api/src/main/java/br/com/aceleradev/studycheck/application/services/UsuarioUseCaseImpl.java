package br.com.aceleradev.studycheck.application.services;

import br.com.aceleradev.studycheck.application.ports.UsuarioRepositoryPort;
import br.com.aceleradev.studycheck.application.usecases.UsuarioUseCase;
import br.com.aceleradev.studycheck.domain.Role;
import br.com.aceleradev.studycheck.domain.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioUseCaseImpl implements UsuarioUseCase {
    private final UsuarioRepositoryPort usuarioRepository;

    public UsuarioUseCaseImpl(UsuarioRepositoryPort usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.listarTodos();
    }

    @Override
    public Usuario buscarOuCriarUsuario(String discordId, String nomeUsuario) {
        return usuarioRepository.buscarPorDiscordId(discordId)
                .orElseGet(() -> {
                    String nome = (nomeUsuario != null && !nomeUsuario.isBlank())
                            ? nomeUsuario : "Discord#" + discordId;
                    Usuario novo = new Usuario(
                            null, nome, discordId + "@discord.user", null, Role.USER, discordId
                    );
                    return usuarioRepository.salvar(novo);
                });
    }

    @Override
    public void updateAvatarUrl(String discordId, String avatarUrl) {
        Usuario usuario = usuarioRepository.buscarPorDiscordId(discordId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuario.setAvatarUrl(avatarUrl);
        usuarioRepository.salvar(usuario);
    }

    @Override
    public Usuario buscarUsuarioPorDiscordId(String discordId) {
        return usuarioRepository.buscarPorDiscordId(discordId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    @Override
    public boolean sincronizarDadosDiscord(String discordId, String nomeUsuario, String avatarUrl) {
        Usuario usuario = usuarioRepository.buscarPorDiscordId(discordId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        boolean mudou = false;
        if (nomeUsuario != null && !nomeUsuario.isBlank() && !nomeUsuario.equals(usuario.getNome())) {
            usuario.setNome(nomeUsuario);
            mudou = true;
        }
        if (avatarUrl != null && !avatarUrl.equals(usuario.getAvatarUrl())) {
            usuario.setAvatarUrl(avatarUrl);
            mudou = true;
        }
        if (mudou) usuarioRepository.salvar(usuario);
        return mudou;
    }
}
