package br.com.aceleradev.studycheck.domain;

import java.time.LocalDate;
import java.util.List;

/**
 * Streak = dias de calendário consecutivos com pelo menos uma sessão concluída.
 * O streak atual permanece vivo se o usuário estudou hoje OU ontem (margem de
 * um dia para não zerar antes do dia acabar).
 */
public record StreakInfo(
        int currentStreak,
        int longestStreak,
        boolean studiedToday,
        LocalDate lastStudyDate
) {
    public static StreakInfo calcular(List<LocalDate> diasComSessao, LocalDate hoje) {
        if (diasComSessao == null || diasComSessao.isEmpty()) {
            return new StreakInfo(0, 0, false, null);
        }

        // Conjunto ordenado desc, sem duplicatas (query já garante DISTINCT/ORDER).
        var dias = diasComSessao.stream().distinct().sorted().toList();
        LocalDate ultimo = dias.get(dias.size() - 1);
        boolean estudouHoje = dias.contains(hoje);

        int maior = 1;
        int run = 1;
        for (int i = 1; i < dias.size(); i++) {
            if (dias.get(i).equals(dias.get(i - 1).plusDays(1))) {
                run++;
            } else {
                run = 1;
            }
            maior = Math.max(maior, run);
        }

        int atual = 0;
        LocalDate ancora = estudouHoje ? hoje
                : (dias.contains(hoje.minusDays(1)) ? hoje.minusDays(1) : null);
        if (ancora != null) {
            var set = new java.util.HashSet<>(dias);
            LocalDate cursor = ancora;
            while (set.contains(cursor)) {
                atual++;
                cursor = cursor.minusDays(1);
            }
        }

        return new StreakInfo(atual, maior, estudouHoje, ultimo);
    }
}
