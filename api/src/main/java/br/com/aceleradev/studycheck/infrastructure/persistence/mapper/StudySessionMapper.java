package br.com.aceleradev.studycheck.infrastructure.persistence.mapper;

import br.com.aceleradev.studycheck.domain.StudySession;
import br.com.aceleradev.studycheck.infrastructure.persistence.entity.StudySessionEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudySessionMapper {
    StudySession toDomain(StudySessionEntity entity);
    StudySessionEntity toEntity(StudySession domain);
    List<StudySession> toDomainList(List<StudySessionEntity> entities);
}
