package br.com.aceleradev.studycheck.infrastructure.web;

import br.com.aceleradev.studycheck.application.usecases.UsuarioUseCase;
import br.com.aceleradev.studycheck.infrastructure.security.ApiKeyValidatorService;
import br.com.aceleradev.studycheck.infrastructure.web.dto.UsuarioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internal/usuarios")
@RequiredArgsConstructor
public class BotUsuarioController {
    private final UsuarioUseCase usuarioUseCase;
    private final ApiKeyValidatorService apiKeyValidatorService;

    @PostMapping("/avatar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizarAvatar(
            @RequestHeader("X-Bot-Api-Key") String apiKey,
            @RequestParam String discordId,
            @RequestParam String avatarUrl
    ) {
        apiKeyValidatorService.validarApiKey(apiKey);
        usuarioUseCase.updateAvatarUrl(discordId, avatarUrl);
    }

    @PutMapping("/sync")
    public SyncResult sincronizar(
            @RequestHeader("X-Bot-Api-Key") String apiKey,
            @RequestParam String discordId,
            @RequestParam(required = false) String nomeUsuario,
            @RequestParam(required = false) String avatarUrl
    ) {
        apiKeyValidatorService.validarApiKey(apiKey);
        return new SyncResult(usuarioUseCase.sincronizarDadosDiscord(discordId, nomeUsuario, avatarUrl));
    }

    @GetMapping("/{discordId}")
    public UsuarioResponse getUsuario(
            @RequestHeader("X-Bot-Api-Key") String apiKey,
            @PathVariable String discordId
    ) {
        apiKeyValidatorService.validarApiKey(apiKey);
        return UsuarioResponse.fromDomain(usuarioUseCase.buscarUsuarioPorDiscordId(discordId));
    }

    @GetMapping
    public List<UsuarioResponse> listar(@RequestHeader("X-Bot-Api-Key") String apiKey) {
        apiKeyValidatorService.validarApiKey(apiKey);
        return usuarioUseCase.listarTodos().stream()
                .filter(u -> u.getDiscordId() != null && !u.getDiscordId().isBlank())
                .map(UsuarioResponse::fromDomain).toList();
    }

    public record SyncResult(boolean atualizado) {}
}
