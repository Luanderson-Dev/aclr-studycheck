package br.com.aceleradev.studycheck.application.services;

import br.com.aceleradev.studycheck.application.ports.StudySessionRepositoryPort;
import br.com.aceleradev.studycheck.application.ports.UsuarioRepositoryPort;
import br.com.aceleradev.studycheck.application.ports.out.SessionEventPublisher;
import br.com.aceleradev.studycheck.application.usecases.StudySessionUseCase;
import br.com.aceleradev.studycheck.domain.StreakInfo;
import br.com.aceleradev.studycheck.domain.StudySession;
import br.com.aceleradev.studycheck.infrastructure.messaging.event.SessionEndedEvent;
import br.com.aceleradev.studycheck.infrastructure.messaging.event.SessionStartedEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class StudySessionUseCaseImpl implements StudySessionUseCase {
    private final StudySessionRepositoryPort sessionRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final SessionEventPublisher eventPublisher;

    public StudySessionUseCaseImpl(
            StudySessionRepositoryPort sessionRepository,
            UsuarioRepositoryPort usuarioRepository,
            SessionEventPublisher eventPublisher
    ) {
        this.sessionRepository = sessionRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public StudySession iniciar(Long usuarioId) {
        usuarioRepository.buscarPorId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        sessionRepository.buscarSessaoAbertaDoUsuario(usuarioId).ifPresent(s -> {
            throw new IllegalStateException("Já existe uma sessão de estudo aberta para este usuário.");
        });

        StudySession nova = sessionRepository.salvar(new StudySession(usuarioId, LocalDateTime.now()));
        eventPublisher.sessionStarted(new SessionStartedEvent(nova.getId(), usuarioId, toEpochMs(nova.getStartedAt())));
        return nova;
    }

    @Override
    @Transactional
    public StudySession encerrar(Long usuarioId) {
        StudySession aberta = sessionRepository.buscarSessaoAbertaDoUsuario(usuarioId)
                .orElseThrow(() -> new IllegalStateException("Não existe sessão aberta para este usuário."));
        aberta.encerrar(LocalDateTime.now());
        StudySession salva = sessionRepository.salvar(aberta);
        eventPublisher.sessionEnded(new SessionEndedEvent(
                salva.getId(), usuarioId, toEpochMs(salva.getStartedAt()),
                toEpochMs(salva.getEndedAt()), salva.calcularMinutosEstudados()
        ));
        return salva;
    }

    @Override
    @Transactional
    public StudySession registrarSessaoConcluida(Long usuarioId, LocalDateTime startedAt, LocalDateTime endedAt) {
        usuarioRepository.buscarPorId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        StudySession sessao = new StudySession(usuarioId, startedAt);
        sessao.encerrar(endedAt);
        StudySession salva = sessionRepository.salvar(sessao);
        eventPublisher.sessionEnded(new SessionEndedEvent(
                salva.getId(), usuarioId, toEpochMs(salva.getStartedAt()),
                toEpochMs(salva.getEndedAt()), salva.calcularMinutosEstudados()
        ));
        return salva;
    }

    @Override
    public StreakInfo calcularStreak(Long usuarioId) {
        usuarioRepository.buscarPorId(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        var dias = sessionRepository.listarDiasComSessao(usuarioId);
        return StreakInfo.calcular(dias, java.time.LocalDate.now(ZoneId.systemDefault()));
    }

    private static long toEpochMs(LocalDateTime dt) {
        return dt.atZone(ZoneId.of("UTC")).toInstant().toEpochMilli();
    }

    @Override
    public List<StudySession> listarPorUsuarioId(Long usuarioId) {
        return sessionRepository.listarPorUsuarioId(usuarioId);
    }

    @Override
    public List<StudySession> listarPorUsuarioIdEPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim) {
        return sessionRepository.listarPorUsuarioIdEPeriodo(usuarioId, inicio, fim);
    }

    @Override
    public Optional<StudySession> buscarSessaoAberta(Long usuarioId) {
        return sessionRepository.buscarSessaoAbertaDoUsuario(usuarioId);
    }
}
