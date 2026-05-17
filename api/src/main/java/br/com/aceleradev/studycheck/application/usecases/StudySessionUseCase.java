package br.com.aceleradev.studycheck.application.usecases;

import br.com.aceleradev.studycheck.domain.StreakInfo;
import br.com.aceleradev.studycheck.domain.StudySession;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudySessionUseCase {
    StreakInfo calcularStreak(Long usuarioId);
    StudySession iniciar(Long usuarioId);
    StudySession encerrar(Long usuarioId);
    StudySession registrarSessaoConcluida(Long usuarioId, LocalDateTime startedAt, LocalDateTime endedAt);
    List<StudySession> listarPorUsuarioId(Long usuarioId);
    List<StudySession> listarPorUsuarioIdEPeriodo(Long usuarioId, LocalDateTime inicio, LocalDateTime fim);
    Optional<StudySession> buscarSessaoAberta(Long usuarioId);
}
