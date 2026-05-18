package br.com.aceleradev.studycheck.infrastructure.messaging.producer;

import br.com.aceleradev.studycheck.application.ports.out.SessionEventPublisher;
import br.com.aceleradev.studycheck.infrastructure.messaging.config.KafkaTopicsConfig;
import br.com.aceleradev.studycheck.infrastructure.messaging.event.SessionEndedEvent;
import br.com.aceleradev.studycheck.infrastructure.messaging.event.SessionStartedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudySessionEventPublisher implements SessionEventPublisher {
    private final KafkaTemplate<String, Object> kafka;

    @Override
    public void sessionStarted(SessionStartedEvent event) {
        kafka.send(KafkaTopicsConfig.SESSION_STARTED, String.valueOf(event.usuarioId()), event);
    }

    @Override
    public void sessionEnded(SessionEndedEvent event) {
        kafka.send(KafkaTopicsConfig.SESSION_ENDED, String.valueOf(event.usuarioId()), event);
    }
}
