package br.com.aceleradev.studycheck.infrastructure.web.dto;

import br.com.aceleradev.studycheck.domain.StudySession;
import br.com.aceleradev.studycheck.domain.Usuario;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

public record StudySessionResponse(
        Long id,
        Long usuarioId,
        String nomeUsuario,
        String email,
        Instant startedAt,
        Instant endedAt,
        long minutosEstudados
) {
    private static Instant utc(LocalDateTime dt) {
        return dt == null ? null : dt.toInstant(ZoneOffset.UTC);
    }

    public static StudySessionResponse fromDomain(StudySession s, Usuario u) {
        return new StudySessionResponse(
                s.getId(),
                s.getUsuarioId(),
                u.getNome(),
                u.getEmail(),
                utc(s.getStartedAt()),
                utc(s.getEndedAt()),
                s.calcularMinutosEstudados()
        );
    }
}
