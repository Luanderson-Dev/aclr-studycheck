package br.com.aceleradev.studycheck.infrastructure.security;

import br.com.aceleradev.studycheck.application.ports.TokenPort;
import br.com.aceleradev.studycheck.domain.DadosToken;
import br.com.aceleradev.studycheck.domain.Role;
import br.com.aceleradev.studycheck.infrastructure.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider implements TokenPort {
    private final SecretKey chave;
    private final long expiracaoAccessToken;

    public JwtTokenProvider(JwtProperties properties) {
        this.chave = Keys.hmacShaKeyFor(properties.getSegredo().getBytes(StandardCharsets.UTF_8));
        this.expiracaoAccessToken = properties.getExpiracaoAccessToken();
    }

    @Override
    public String gerarAccessToken(Long usuarioId, String email, Role role) {
        Date agora = new Date();
        return Jwts.builder()
                .subject(usuarioId.toString())
                .claim("email", email)
                .claim("role", role.name())
                .issuedAt(agora)
                .expiration(new Date(agora.getTime() + expiracaoAccessToken))
                .signWith(chave)
                .compact();
    }

    @Override
    public String gerarRefreshToken() {
        return UUID.randomUUID().toString();
    }

    @Override
    public DadosToken extrairDadosToken(String accessToken) {
        Claims claims = Jwts.parser().verifyWith(chave).build().parseSignedClaims(accessToken).getPayload();
        return new DadosToken(
                Long.valueOf(claims.getSubject()),
                claims.get("email", String.class),
                Role.valueOf(claims.get("role", String.class))
        );
    }

    @Override
    public boolean validarAccessToken(String accessToken) {
        try {
            Jwts.parser().verifyWith(chave).build().parseSignedClaims(accessToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
