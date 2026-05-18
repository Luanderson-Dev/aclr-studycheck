CREATE TABLE usuarios
(
    id         SERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255),
    role       VARCHAR(20)  NOT NULL,
    discord_id VARCHAR(30) UNIQUE,
    avatar_url VARCHAR(512)
);

CREATE TABLE study_sessions
(
    id         SERIAL PRIMARY KEY,
    usuario_id BIGINT    NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at   TIMESTAMP,
    CONSTRAINT fk_usuario_session FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens
(
    id         SERIAL PRIMARY KEY,
    token      VARCHAR(255) NOT NULL UNIQUE,
    usuario_id BIGINT       NOT NULL,
    criado_em  TIMESTAMP    NOT NULL,
    expira_em  TIMESTAMP    NOT NULL,
    revogado   BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_refresh_token_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE INDEX idx_usuario_email ON usuarios (email);
CREATE INDEX idx_usuario_discord ON usuarios (discord_id);
CREATE INDEX idx_session_usuario ON study_sessions (usuario_id);
CREATE INDEX idx_refresh_token_token ON refresh_tokens (token);
CREATE INDEX idx_refresh_token_usuario ON refresh_tokens (usuario_id);
