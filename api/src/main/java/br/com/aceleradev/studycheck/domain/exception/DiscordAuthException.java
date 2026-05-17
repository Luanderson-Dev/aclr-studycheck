package br.com.aceleradev.studycheck.domain.exception;

public class DiscordAuthException extends RuntimeException {
    public DiscordAuthException(String message) {
        super(message);
    }
}
