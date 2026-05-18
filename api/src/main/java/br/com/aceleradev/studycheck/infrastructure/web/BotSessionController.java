package br.com.aceleradev.studycheck.infrastructure.web;

import br.com.aceleradev.studycheck.application.usecases.StudySessionUseCase;
import br.com.aceleradev.studycheck.application.usecases.UsuarioUseCase;
import br.com.aceleradev.studycheck.domain.StudySession;
import br.com.aceleradev.studycheck.domain.Usuario;
import br.com.aceleradev.studycheck.infrastructure.security.ApiKeyValidatorService;
import br.com.aceleradev.studycheck.infrastructure.web.dto.StudySessionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/sessions")
@RequiredArgsConstructor
public class BotSessionController {
    private final StudySessionUseCase sessionUseCase;
    private final UsuarioUseCase usuarioUseCase;
    private final ApiKeyValidatorService apiKeyValidatorService;

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public StudySessionResponse start(
            @RequestHeader("X-Bot-Api-Key") String apiKey,
            @RequestParam String discordId,
            @RequestParam(required = false) String nomeUsuario
    ) {
        apiKeyValidatorService.validarApiKey(apiKey);
        Usuario u = usuarioUseCase.buscarOuCriarUsuario(discordId, nomeUsuario);
        StudySession s = sessionUseCase.iniciar(u.getId());
        return StudySessionResponse.fromDomain(s, u);
    }

    @PostMapping("/stop")
    public StudySessionResponse stop(
            @RequestHeader("X-Bot-Api-Key") String apiKey,
            @RequestParam String discordId,
            @RequestParam(required = false) String nomeUsuario
    ) {
        apiKeyValidatorService.validarApiKey(apiKey);
        Usuario u = usuarioUseCase.buscarOuCriarUsuario(discordId, nomeUsuario);
        StudySession s = sessionUseCase.encerrar(u.getId());
        return StudySessionResponse.fromDomain(s, u);
    }
}
