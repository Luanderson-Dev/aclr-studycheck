package br.com.aceleradev.studycheck.domain;

public class Usuario {
    private Long id;
    private String nome;
    private String email;
    private String senhaHash;
    private Role role;
    private String discordId;
    private String avatarUrl;

    public Usuario() {}

    public Usuario(Long id, String nome, String email, String senhaHash, Role role) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.role = role;
    }

    public Usuario(Long id, String nome, String email, String senhaHash, Role role, String discordId) {
        this(id, nome, email, senhaHash, role);
        this.discordId = discordId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getDiscordId() { return discordId; }
    public void setDiscordId(String discordId) { this.discordId = discordId; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
