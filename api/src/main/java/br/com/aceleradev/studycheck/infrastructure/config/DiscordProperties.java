package br.com.aceleradev.studycheck.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.discord")
public class DiscordProperties {
    private String clientId;
    private String clientSecret;
    private String redirectUri;
    private String guildId;
    private String modRoleId;

    public String getClientId() { return clientId; }
    public void setClientId(String v) { this.clientId = v; }

    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String v) { this.clientSecret = v; }

    public String getRedirectUri() { return redirectUri; }
    public void setRedirectUri(String v) { this.redirectUri = v; }

    public String getGuildId() { return guildId; }
    public void setGuildId(String v) { this.guildId = v; }

    public String getModRoleId() { return modRoleId; }
    public void setModRoleId(String v) { this.modRoleId = v; }
}
