package br.com.aceleradev.studycheck.domain;

import java.time.Duration;
import java.time.LocalDateTime;

public class StudySession {
    private Long id;
    private Long usuarioId;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    public StudySession() {}

    public StudySession(Long usuarioId, LocalDateTime startedAt) {
        this.usuarioId = usuarioId;
        this.startedAt = startedAt;
    }

    public void encerrar(LocalDateTime hora) {
        if (this.endedAt != null) {
            throw new IllegalStateException("Sessão já foi encerrada.");
        }
        if (hora.isBefore(this.startedAt)) {
            throw new IllegalArgumentException("Hora de encerramento não pode ser anterior ao início.");
        }
        this.endedAt = hora;
    }

    public long calcularMinutosEstudados() {
        if (this.endedAt == null) return 0;
        return Duration.between(this.startedAt, this.endedAt).toMinutes();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getEndedAt() { return endedAt; }
    public void setEndedAt(LocalDateTime endedAt) { this.endedAt = endedAt; }
}
