package br.com.aceleradev.studycheck.infrastructure.persistence.repository;

import br.com.aceleradev.studycheck.infrastructure.persistence.entity.StudySessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SpringStudySessionRepository extends JpaRepository<StudySessionEntity, Long> {
    Optional<StudySessionEntity> findByUsuarioIdAndEndedAtIsNull(Long usuarioId);
    List<StudySessionEntity> findAllByUsuarioId(Long usuarioId);
    List<StudySessionEntity> findAllByUsuarioIdAndStartedAtBetween(Long usuarioId, LocalDateTime inicio, LocalDateTime fim);

    @Query(value = """
            SELECT u.id AS usuarioId, u.nome AS nomeUsuario, u.avatar_url AS avatarUrl,
                   COALESCE(SUM(EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) / 60), 0) AS totalMinutos
            FROM usuarios u
            LEFT JOIN study_sessions s ON s.usuario_id = u.id AND s.ended_at IS NOT NULL
            GROUP BY u.id, u.nome, u.avatar_url
            ORDER BY totalMinutos DESC
            """, nativeQuery = true)
    List<LeaderboardProjection> findLeaderboard();

    @Query(value = """
            SELECT u.id AS usuarioId, u.nome AS nomeUsuario, u.avatar_url AS avatarUrl,
                   COALESCE(SUM(EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) / 60), 0) AS totalMinutos
            FROM usuarios u
            LEFT JOIN study_sessions s ON s.usuario_id = u.id AND s.ended_at IS NOT NULL
                AND s.started_at >= :inicio AND s.started_at < :fim
            GROUP BY u.id, u.nome, u.avatar_url
            ORDER BY totalMinutos DESC
            """, nativeQuery = true)
    List<LeaderboardProjection> findLeaderboardByPeriod(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim
    );

    @Query(value = """
            SELECT DISTINCT DATE(started_at) AS dia
            FROM study_sessions
            WHERE usuario_id = :usuarioId AND ended_at IS NOT NULL
            ORDER BY dia DESC
            """, nativeQuery = true)
    List<LocalDate> findDistinctStudyDates(Long usuarioId);
}
