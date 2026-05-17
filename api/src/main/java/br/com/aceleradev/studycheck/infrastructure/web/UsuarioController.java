package br.com.aceleradev.studycheck.infrastructure.web;

import br.com.aceleradev.studycheck.application.usecases.UsuarioUseCase;
import br.com.aceleradev.studycheck.infrastructure.web.dto.UsuarioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MOD')")
public class UsuarioController {
    private final UsuarioUseCase usuarioUseCase;

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioUseCase.listarTodos().stream().map(UsuarioResponse::fromDomain).toList();
    }
}
