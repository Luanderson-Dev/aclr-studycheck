package br.com.aceleradev.studycheck.infrastructure.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ApiKeyValidatorService {
    @Value("${app.bot.api-key}")
    private String botApiKey;

    public void validarApiKey(String apiKey) {
        if (!botApiKey.equals(apiKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "API key inválida");
        }
    }
}
