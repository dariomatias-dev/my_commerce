package com.dariomatias.my_commerce.util;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Random;

public class RandomUtil {

    private static final Random RANDOM = new Random();

    public static boolean chance(int percent) {
        if (percent <= 0) return false;
        if (percent >= 100) return true;
        return RANDOM.nextInt(100) < percent;
    }

    public static LocalDateTime randomPastDate(int maxDaysAgo) {
        int daysAgo = RANDOM.nextInt(maxDaysAgo + 1);
        return LocalDateTime.now().minusDays(daysAgo);
    }

    public static RandomResult randomDeletion(int chancePercent, int maxDaysAgo) {
        boolean deleted = chance(chancePercent);
        LocalDateTime deletedAt = deleted ? randomPastDate(maxDaysAgo) : null;
        return new RandomResult(deleted, deletedAt);
    }

    @Getter
    public static class RandomResult {
        private final boolean deleted;
        private final LocalDateTime deletedAt;

        public RandomResult(boolean deleted, LocalDateTime deletedAt) {
            this.deleted = deleted;
            this.deletedAt = deletedAt;
        }

    }
}
