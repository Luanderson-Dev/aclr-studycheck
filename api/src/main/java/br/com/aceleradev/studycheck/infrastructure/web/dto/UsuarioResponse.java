package br.com.aceleradev.studycheck.infrastructure.web.dto;

import br.com.aceleradev.studycheck.domain.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String role,
        String discordId,
        String avatarUrl
) {
    public static UsuarioResponse fromDomain(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getRole().name(), u.getDiscordId(), u.getAvatarUrl());
    }
}
