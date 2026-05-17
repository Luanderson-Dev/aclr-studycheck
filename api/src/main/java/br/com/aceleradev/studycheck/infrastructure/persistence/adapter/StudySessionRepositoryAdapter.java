package br.com.aceleradev.studycheck.infrastructure.persistence.adapter;

import br.com.aceleradev.studycheck.application.ports.StudySessionRepositoryPort;
import br.com.aceleradev.studycheck.domain.StudySession;
import br.com.aceleradev.studycheck.infrastructure.persistence.mapper.StudySessionMapper;
import br.com.aceleradev.studycheck.infrastructure.persistence.repository.SpringStudySessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class StudySessionRepositoryAdapter implements StudySessionRepositoryPort {
    private final SpringStudySessionRepository repository;
    private final StudySessionMapper mapper;

    @Override
    public StudySession salvar(StudySession session) {
        return mapper.toDomain(repository.save(mapper.toEntity(session)));
    }

    @Override
    public Optional<StudySession> buscarSessaoAbertaDoUsuario(Long usuarioId) {
        return repository.findByUsuarioIdAndEndedAtIsNull(usuarioId).map(mapper::toDomain);
    }

    @Override
    public List<StudySession> listarPorUsuarioId(Long usuarioId) {
        return mapper.toDomainList(repository.findAllByUsuarioId(usuarioId));
    }

    @Override
    public List<StudySession> listarPorUsuarioIdEPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim) {
        return mapper.toDomainList(repository.findAllByUsuarioIdAndStartedAtBetween(usuarioId, inicio, fim));
    }

    @Override
    public List<LocalDate> listarDiasComSessao(Long usuarioId) {
        return repository.findDistinctStudyDates(usuarioId);
    }
}
