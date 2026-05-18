package br.com.aceleradev.studycheck.infrastructure.persistence.repository;

import br.com.aceleradev.studycheck.infrastructure.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringUsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByEmail(String email);
    Optional<UsuarioEntity> findByDiscordId(String discordId);
}
