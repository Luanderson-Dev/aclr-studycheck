package br.com.aceleradev.studycheck.domain.exception;

public class TokenInvalidoException extends RuntimeException {
    public TokenInvalidoException() {
        super("Token inválido ou expirado.");
    }
}
