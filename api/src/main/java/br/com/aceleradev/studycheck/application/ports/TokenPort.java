package br.com.aceleradev.studycheck.application.ports;

import br.com.aceleradev.studycheck.domain.DadosToken;
import br.com.aceleradev.studycheck.domain.Role;

public interface TokenPort {
    String gerarAccessToken(Long usuarioId, String email, Role role);
    String gerarRefreshToken();
    DadosToken extrairDadosToken(String accessToken);
    boolean validarAccessToken(String accessToken);
}
