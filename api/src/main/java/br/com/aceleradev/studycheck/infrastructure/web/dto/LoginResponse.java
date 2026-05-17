package br.com.aceleradev.studycheck.infrastructure.web.dto;

public record LoginResponse(
        String accessToken,
        String nomeUsuario,
        String email,
        String role
) {}
