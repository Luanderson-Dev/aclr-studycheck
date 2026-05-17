package br.com.aceleradev.studycheck.application.services;

import br.com.aceleradev.studycheck.application.ports.RefreshTokenRepositoryPort;
import br.com.aceleradev.studycheck.application.ports.TokenPort;
import br.com.aceleradev.studycheck.application.ports.UsuarioRepositoryPort;
import br.com.aceleradev.studycheck.application.usecases.AutenticacaoUseCase;
import br.com.aceleradev.studycheck.domain.RefreshToken;
import br.com.aceleradev.studycheck.domain.RespostaLogin;
import br.com.aceleradev.studycheck.domain.Role;
import br.com.aceleradev.studycheck.domain.Usuario;
import br.com.aceleradev.studycheck.domain.exception.TokenInvalidoException;
import br.com.aceleradev.studycheck.infrastructure.config.JwtProperties;
import br.com.aceleradev.studycheck.infrastructure.security.DiscordOAuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AutenticacaoUseCaseImpl implements AutenticacaoUseCase {
    private final UsuarioRepositoryPort usuarioRepository;
    private final RefreshTokenRepositoryPort refreshTokenRepository;
    private final TokenPort tokenPort;
    private final DiscordOAuthService discordOAuthService;
    private final long expiracaoRefreshTokenMs;

    public AutenticacaoUseCaseImpl(
            UsuarioRepositoryPort usuarioRepository,
            RefreshTokenRepositoryPort refreshTokenRepository,
            TokenPort tokenPort,
            DiscordOAuthService discordOAuthService,
            JwtProperties jwtProperties
    ) {
        this.usuarioRepository = usuarioRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenPort = tokenPort;
        this.discordOAuthService = discordOAuthService;
        this.expiracaoRefreshTokenMs = jwtProperties.getExpiracaoRefreshToken();
    }

    @Override
    @Transactional
    public RespostaLogin loginComDiscord(String code) {
        String discordAccessToken = discordOAuthService.trocarCodePorToken(code);
        var memberData = discordOAuthService.obterMembroDoServidor(discordAccessToken);
        DiscordOAuthService.DiscordUser discordUser = discordOAuthService.obterUsuario(discordAccessToken);
        Role discordRole = discordOAuthService.determinarRole(memberData);
        String nomeNoServidor = discordOAuthService.extrairNomeNoServidor(memberData, discordUser);

        Usuario usuario = usuarioRepository.buscarPorDiscordId(discordUser.id())
                .map(existente -> {
                    boolean atualizado = false;
                    if (existente.getRole() != discordRole) {
                        existente.setRole(discordRole);
                        atualizado = true;
                    }
                    if (discordUser.avatarUrl() != null && !discordUser.avatarUrl().equals(existente.getAvatarUrl())) {
                        existente.setAvatarUrl(discordUser.avatarUrl());
                        atualizado = true;
                    }
                    if (nomeNoServidor != null && !nomeNoServidor.equals(existente.getNome())) {
                        existente.setNome(nomeNoServidor);
                        atualizado = true;
                    }
                    return atualizado ? usuarioRepository.salvar(existente) : existente;
                })
                .orElseGet(() -> {
                    String email = discordUser.email() != null
                            ? discordUser.email()
                            : discordUser.id() + "@discord.user";
                    Usuario novo = new Usuario(null, nomeNoServidor, email, null, discordRole, discordUser.id());
                    novo.setAvatarUrl(discordUser.avatarUrl());
                    return usuarioRepository.salvar(novo);
                });

        return gerarRespostaLogin(usuario);
    }

    @Override
    @Transactional
    public RespostaLogin renovarToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.buscarPorToken(refreshTokenValue)
                .orElseThrow(TokenInvalidoException::new);

        if (!refreshToken.estaValido()) {
            refreshTokenRepository.revogarTodosPorUsuarioId(refreshToken.getUsuarioId());
            throw new TokenInvalidoException();
        }

        refreshToken.revogar();
        refreshTokenRepository.salvar(refreshToken);

        Usuario usuario = usuarioRepository.buscarPorId(refreshToken.getUsuarioId())
                .orElseThrow(TokenInvalidoException::new);

        return gerarRespostaLogin(usuario);
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.buscarPorToken(refreshTokenValue).ifPresent(token -> {
            token.revogar();
            refreshTokenRepository.salvar(token);
        });
    }

    private RespostaLogin gerarRespostaLogin(Usuario usuario) {
        String accessToken = tokenPort.gerarAccessToken(usuario.getId(), usuario.getEmail(), usuario.getRole());
        String refreshTokenValue = tokenPort.gerarRefreshToken();

        Instant agora = Instant.now();
        refreshTokenRepository.salvar(new RefreshToken(
                refreshTokenValue,
                usuario.getId(),
                agora,
                agora.plus(expiracaoRefreshTokenMs, ChronoUnit.MILLIS)
        ));

        return new RespostaLogin(accessToken, refreshTokenValue, usuario.getNome(), usuario.getEmail(), usuario.getRole().name());
    }
}
