package br.com.aceleradev.studycheck.infrastructure.persistence.mapper;

import br.com.aceleradev.studycheck.domain.RefreshToken;
import br.com.aceleradev.studycheck.infrastructure.persistence.entity.RefreshTokenEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RefreshTokenMapper {
    RefreshToken toDomain(RefreshTokenEntity entity);
    RefreshTokenEntity toEntity(RefreshToken domain);
}
