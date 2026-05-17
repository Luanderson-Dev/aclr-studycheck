package br.com.aceleradev.studycheck.infrastructure.web;

import br.com.aceleradev.studycheck.application.ports.UsuarioRepositoryPort;
import br.com.aceleradev.studycheck.application.usecases.StudySessionUseCase;
import br.com.aceleradev.studycheck.domain.DadosToken;
import br.com.aceleradev.studycheck.domain.StudySession;
import br.com.aceleradev.studycheck.domain.Usuario;
import br.com.aceleradev.studycheck.infrastructure.persistence.repository.SpringStudySessionRepository;
import br.com.aceleradev.studycheck.infrastructure.web.dto.LeaderboardEntryResponse;
import br.com.aceleradev.studycheck.infrastructure.web.dto.SessionAbertaResponse;
import br.com.aceleradev.studycheck.infrastructure.web.dto.StreakResponse;
import br.com.aceleradev.studycheck.infrastructure.web.dto.StudySessionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final StudySessionUseCase sessionUseCase;
    private final UsuarioRepositoryPort usuarioRepository;
    private final SpringStudySessionRepository springSessionRepository;

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public StudySessionResponse iniciar(@AuthenticationPrincipal DadosToken dados) {
        StudySession s = sessionUseCase.iniciar(dados.usuarioId());
        return StudySessionResponse.fromDomain(s, buscarUsuario(dados.usuarioId()));
    }

    @PostMapping("/stop")
    public StudySessionResponse encerrar(@AuthenticationPrincipal DadosToken dados) {
        StudySession s = sessionUseCase.encerrar(dados.usuarioId());
        return StudySessionResponse.fromDomain(s, buscarUsuario(dados.usuarioId()));
    }

    @GetMapping("/streak")
    public StreakResponse streak(@AuthenticationPrincipal DadosToken dados) {
        return StreakResponse.fromDomain(sessionUseCase.calcularStreak(dados.usuarioId()));
    }

    @GetMapping("/aberta")
    public SessionAbertaResponse verificarAberta(@AuthenticationPrincipal DadosToken dados) {
        return sessionUseCase.buscarSessaoAberta(dados.usuarioId())
                .map(s -> new SessionAbertaResponse(true, s.getStartedAt().toInstant(java.time.ZoneOffset.UTC)))
                .orElse(new SessionAbertaResponse(false, null));
    }

    @GetMapping("/minhas")
    public List<StudySessionResponse> listarMinhas(@AuthenticationPrincipal DadosToken dados) {
        Usuario u = buscarUsuario(dados.usuarioId());
        return sessionUseCase.listarPorUsuarioId(dados.usuarioId()).stream()
                .map(s -> StudySessionResponse.fromDomain(s, u)).toList();
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('MOD')")
    public List<StudySessionResponse> listarAdmin(
            @RequestParam Long usuarioId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim
    ) {
        LocalDateTime inicio = dataInicio.atStartOfDay();
        LocalDateTime fim = dataFim.atTime(LocalTime.MAX);
        Usuario u = buscarUsuario(usuarioId);
        return sessionUseCase.listarPorUsuarioIdEPeriodo(usuarioId, inicio, fim).stream()
                .map(s -> StudySessionResponse.fromDomain(s, u)).toList();
    }

    @GetMapping("/leaderboard")
    public List<LeaderboardEntryResponse> leaderboard() {
        AtomicInteger pos = new AtomicInteger(1);
        return springSessionRepository.findLeaderboard().stream()
                .map(p -> new LeaderboardEntryResponse(
                        pos.getAndIncrement(), p.getNomeUsuario(), p.getAvatarUrl(), p.getTotalMinutos(),
                        sessionUseCase.calcularStreak(p.getUsuarioId()).currentStreak()
                )).toList();
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }
}
