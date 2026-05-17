package br.com.aceleradev.studycheck.infrastructure.web.dto;

import java.time.Instant;

public record SessionAbertaResponse(
        boolean aberta,
        Instant startedAt
) {}
