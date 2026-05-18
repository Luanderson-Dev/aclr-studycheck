package br.com.aceleradev.studycheck.application.usecases;

import br.com.aceleradev.studycheck.domain.RespostaLogin;

public interface AutenticacaoUseCase {
    RespostaLogin loginComDiscord(String code);
    RespostaLogin renovarToken(String refreshToken);
    void logout(String refreshToken);
}
