package br.com.aceleradev.studycheck.application.ports;

import br.com.aceleradev.studycheck.domain.StudySession;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudySessionRepositoryPort {
    StudySession salvar(StudySession session);
    Optional<StudySession> buscarSessaoAbertaDoUsuario(Long usuarioId);
    List<StudySession> listarPorUsuarioId(Long usuarioId);
    List<StudySession> listarPorUsuarioIdEPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim);
    List<LocalDate> listarDiasComSessao(Long usuarioId);
}
