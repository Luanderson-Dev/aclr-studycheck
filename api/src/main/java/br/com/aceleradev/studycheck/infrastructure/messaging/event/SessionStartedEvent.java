package br.com.aceleradev.studycheck.infrastructure.messaging.event;

/** Timestamps em epoch millis — evita acoplar serialização java.time no Kafka JsonSerializer. */
public record SessionStartedEvent(
        Long sessionId,
        Long usuarioId,
        long startedAtMs
) {}
