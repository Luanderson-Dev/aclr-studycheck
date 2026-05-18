package br.com.aceleradev.studycheck.infrastructure.persistence.mapper;

import br.com.aceleradev.studycheck.domain.Usuario;
import br.com.aceleradev.studycheck.infrastructure.persistence.entity.UsuarioEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {
    Usuario toDomain(UsuarioEntity entity);
    UsuarioEntity toEntity(Usuario domain);
}
