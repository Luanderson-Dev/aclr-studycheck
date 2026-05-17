package br.com.aceleradev.studycheck.infrastructure.web.dto;

import br.com.aceleradev.studycheck.domain.StreakInfo;

import java.time.LocalDate;

public record StreakResponse(
        int currentStreak,
        int longestStreak,
        boolean studiedToday,
        LocalDate lastStudyDate
) {
    public static StreakResponse fromDomain(StreakInfo s) {
        return new StreakResponse(
                s.currentStreak(),
                s.longestStreak(),
                s.studiedToday(),
                s.lastStudyDate()
        );
    }
}
