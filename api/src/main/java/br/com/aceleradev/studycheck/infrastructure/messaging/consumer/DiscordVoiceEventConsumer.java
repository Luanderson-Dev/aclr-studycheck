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

    /**
     * Usuário entrou em canal de voz monitorado → abre sessão de estudo.
     * Idempotente: se já existe sessão aberta (redelivery Kafka), ignora.
     */
    @KafkaListener(
            topics = "studycheck.discord.voice-joined",
            groupId = "${spring.kafka.consumer.group-id}.voice",
            properties = DEFAULT_TYPE
    )
    public void onVoiceJoined(DiscordVoiceEvent event, Acknowledgment ack) {
        try {
            Usuario u = usuarioUseCase.buscarOuCriarUsuario(event.userId(), event.displayName());

            if (studySessionUseCase.buscarSessaoAberta(u.getId()).isPresent()) {
                log.info("[voice-joined] {} ({}) — sessão já aberta, ignorado (idempotente)",
                        event.displayName(), event.userId());
            } else {
                studySessionUseCase.iniciar(u.getId());
                log.info("[voice-joined] sessão aberta: {} ({}) canal={}",
                        event.displayName(), event.userId(), event.channelId());
            }
            ack.acknowledge();
        } catch (Exception e) {
            log.error("[voice-joined] falha ao processar {}: {}", event.userId(), e.getMessage());
            throw e;
        }
    }

    /**
     * Usuário saiu de canal de voz → encerra a sessão aberta.
     * Duração é server-authoritative (usa started_at gravado no voice-joined).
     * Fallback: se não há sessão aberta (voice-joined perdido — api estava down),
     * registra sessão concluída com a janela calculada pelo bot.
     */
    @KafkaListener(
            topics = "studycheck.discord.voice-left",
            groupId = "${spring.kafka.consumer.group-id}.voice",
            properties = DEFAULT_TYPE
    )
    public void onVoiceLeft(DiscordVoiceEvent event, Acknowledgment ack) {
        try {
            Usuario u = usuarioUseCase.buscarOuCriarUsuario(event.userId(), event.displayName());

            if (studySessionUseCase.buscarSessaoAberta(u.getId()).isPresent()) {
                studySessionUseCase.encerrar(u.getId());
                log.info("[voice-left] sessão encerrada (server-time): {} ({})",
                        event.displayName(), event.userId());
                ack.acknowledge();
                return;
            }

            // Fallback — join não foi processado. Usa janela do bot.
            LocalDateTime startedAt = toLocal(event.startedAtMs());
            LocalDateTime endedAt = toLocal(event.endedAtMs());
            if (startedAt == null || endedAt == null || !endedAt.isAfter(startedAt)) {
                log.warn("[voice-left] {} ignorado — sem sessão aberta e janela inválida (start={} end={})",
                        event.userId(), startedAt, endedAt);
                ack.acknowledge();
                return;
            }
            studySessionUseCase.registrarSessaoConcluida(u.getId(), startedAt, endedAt);
            log.info("[voice-left] sessão registrada via fallback (bot-time): {} ({}) {}→{}",
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
