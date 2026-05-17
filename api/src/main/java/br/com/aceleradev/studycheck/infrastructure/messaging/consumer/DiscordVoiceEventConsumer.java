package br.com.aceleradev.studycheck.infrastructure.messaging.consumer;

import br.com.aceleradev.studycheck.application.usecases.StudySessionUseCase;
import br.com.aceleradev.studycheck.application.usecases.UsuarioUseCase;
import br.com.aceleradev.studycheck.domain.Usuario;
import br.com.aceleradev.studycheck.infrastructure.messaging.event.DiscordVoiceEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Slf4j
@Component
@RequiredArgsConstructor
public class DiscordVoiceEventConsumer {

    private static final String DEFAULT_TYPE =
            "spring.json.value.default.type=br.com.aceleradev.studycheck.infrastructure.messaging.event.DiscordVoiceEvent";

    private final UsuarioUseCase usuarioUseCase;
    private final StudySessionUseCase studySessionUseCase;

    @KafkaListener(
            topics = "studycheck.discord.voice-joined",
            groupId = "${spring.kafka.consumer.group-id}.voice",
            properties = DEFAULT_TYPE
    )
    public void onVoiceJoined(DiscordVoiceEvent event, Acknowledgment ack) {
        try {
            // Upsert do usuário — garante existência antes do voice-left.
            usuarioUseCase.buscarOuCriarUsuario(event.userId(), event.displayName());
            log.info("[voice-joined] {} ({}) canal={}",
                    event.displayName(), event.userId(), event.channelId());
            ack.acknowledge();
        } catch (Exception e) {
            log.error("[voice-joined] falha ao processar {}: {}", event.userId(), e.getMessage());
            throw e;
        }
    }

    @KafkaListener(
            topics = "studycheck.discord.voice-left",
            groupId = "${spring.kafka.consumer.group-id}.voice",
            properties = DEFAULT_TYPE
    )
    public void onVoiceLeft(DiscordVoiceEvent event, Acknowledgment ack) {
        try {
            LocalDateTime startedAt = toLocal(event.startedAtMs());
            LocalDateTime endedAt = toLocal(event.endedAtMs());

            if (startedAt == null || endedAt == null || !endedAt.isAfter(startedAt)) {
                log.warn("[voice-left] {} ignorado — janela inválida (start={} end={})",
                        event.userId(), startedAt, endedAt);
                ack.acknowledge();
                return;
            }

            Usuario u = usuarioUseCase.buscarOuCriarUsuario(event.userId(), event.displayName());
            studySessionUseCase.registrarSessaoConcluida(u.getId(), startedAt, endedAt);
            log.info("[voice-left] sessão registrada: {} ({}) {}→{}",
                    event.displayName(), event.userId(), startedAt, endedAt);
            ack.acknowledge();
        } catch (Exception e) {
            log.error("[voice-left] falha ao processar {}: {}", event.userId(), e.getMessage());
            throw e;
        }
    }

    private static LocalDateTime toLocal(Long epochMs) {
        if (epochMs == null) return null;
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMs), ZoneId.of("UTC"));
    }
}
