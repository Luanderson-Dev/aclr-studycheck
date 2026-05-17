package br.com.aceleradev.studycheck.application.usecases;

import br.com.aceleradev.studycheck.domain.Usuario;

import java.util.List;

public interface UsuarioUseCase {
    List<Usuario> listarTodos();
    Usuario buscarOuCriarUsuario(String discordId, String nomeUsuario);
    void updateAvatarUrl(String discordId, String avatarUrl);
    Usuario buscarUsuarioPorDiscordId(String discordId);
    boolean sincronizarDadosDiscord(String discordId, String nomeUsuario, String avatarUrl);
}
