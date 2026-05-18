package br.com.aceleradev.studycheck.infrastructure.web;

import br.com.aceleradev.studycheck.application.usecases.AutenticacaoUseCase;
import br.com.aceleradev.studycheck.domain.RespostaLogin;
import br.com.aceleradev.studycheck.infrastructure.config.DiscordProperties;
import br.com.aceleradev.studycheck.infrastructure.web.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AutenticacaoUseCase autenticacaoUseCase;
    private final DiscordProperties discordProperties;

    @Value("${app.security.jwt.expiracao-refresh-token}")
    private long expiracaoRefreshTokenMs;

    @Value("${app.security.cookie.seguro:true}")
    private boolean cookieSeguro;

    @GetMapping("/discord/url")
    public ResponseEntity<Map<String, String>> discordAuthUrl() {
        String url = UriComponentsBuilder.fromUriString("https://discord.com/oauth2/authorize")
                .queryParam("client_id", discordProperties.getClientId())
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", discordProperties.getRedirectUri())
                .queryParam("scope", "identify email guilds.members.read")
                .build().toUriString();
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/discord/token")
    public ResponseEntity<LoginResponse> discordCallback(@RequestParam("code") String code) {
        RespostaLogin r = autenticacaoUseCase.loginComDiscord(code);
        return respond(r);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@CookieValue("refreshToken") String refreshToken) {
        return respond(autenticacaoUseCase.renovarToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken != null) autenticacaoUseCase.logout(refreshToken);
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).secure(cookieSeguro).path("/auth").maxAge(0).build();
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookie.toString()).build();
    }

    private ResponseEntity<LoginResponse> respond(RespostaLogin r) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", r.getRefreshToken())
                .httpOnly(true).secure(cookieSeguro).sameSite("Strict").path("/auth")
                .maxAge(Duration.ofMillis(expiracaoRefreshTokenMs)).build();
        LoginResponse body = new LoginResponse(r.getAccessToken(), r.getNomeUsuario(), r.getEmail(), r.getRole());
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(body);
    }
}
