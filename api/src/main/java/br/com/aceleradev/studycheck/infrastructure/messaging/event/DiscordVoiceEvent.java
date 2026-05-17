package br.com.aceleradev.studycheck.infrastructure.messaging.event;

/**
 * Evento de voz publicado pelo bot. Mesmo contrato para voice-joined e
 * voice-left; campos de duração só vêm preenchidos em voice-left
 * (bot manda a duração já calculada via Redis).
 *
 * Timestamps em epoch millis (UTC) — evita acoplar serialização de
 * data entre bot (kafkajs/JSON) e api (Spring Kafka JsonDeserializer).
 */
public record DiscordVoiceEvent(
        String userId,
        String channelId,
        String guildId,
        String displayName,
        Long timestampMs,
        Long startedAtMs,
        Long endedAtMs,
        Long durationMs
) {}
