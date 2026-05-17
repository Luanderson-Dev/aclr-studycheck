package br.com.aceleradev.studycheck.application.ports.out;

import br.com.aceleradev.studycheck.infrastructure.messaging.event.SessionEndedEvent;
import br.com.aceleradev.studycheck.infrastructure.messaging.event.SessionStartedEvent;

public interface SessionEventPublisher {
    void sessionStarted(SessionStartedEvent event);
    void sessionEnded(SessionEndedEvent event);
}
