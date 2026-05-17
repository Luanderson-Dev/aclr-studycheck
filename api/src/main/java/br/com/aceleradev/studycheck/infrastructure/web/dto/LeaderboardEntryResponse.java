package br.com.aceleradev.studycheck.infrastructure.web.dto;

public record LeaderboardEntryResponse(
        int posicao,
        String nomeUsuario,
        String avatarUrl,
        long totalMinutos,
        int currentStreak
) {}
